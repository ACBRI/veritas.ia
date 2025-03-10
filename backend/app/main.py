from fastapi import FastAPI, WebSocket, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import json
from typing import List, Optional
import asyncio
from fastapi.responses import JSONResponse
from geoalchemy2.elements import WKTElement
from . import models, schemas
from .database import get_db, engine
from .redis_client import redis_client
from .rate_limiter import RateLimiter
from .websocket_manager import WebSocketManager

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Veritas.ai API")
ws_manager = WebSocketManager()
rate_limiter = RateLimiter()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/reports/", response_model=schemas.Report)
async def create_report(
    report: schemas.ReportCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    # Check rate limiting
    client_ip = request.client.host
    if not rate_limiter.can_make_request(client_ip):
        raise HTTPException(status_code=429, detail="Too many requests")

    try:
        # Create WKT format for PostGIS
        point_wkt = f'POINT({report.coordinates.longitude} {report.coordinates.latitude})'
        print(f"Creating report with location: {point_wkt}")
        
        # Create report with 24-hour expiration
        db_report = models.Report(
            offense_type_id=report.offense_type_id,
            location=WKTElement(point_wkt, srid=4326),
            accuracy=report.coordinates.accuracy,
            expires_at=datetime.utcnow() + timedelta(hours=24)
        )
        
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        
        # Convert location to GeoJSON string
        db_report.location = f'{{"type": "Point", "coordinates": [{report.coordinates.longitude}, {report.coordinates.latitude}]}}'
        
        # Notify connected clients about new report
        await ws_manager.broadcast_report(db_report)
        
        return db_report
    except Exception as e:
        db.rollback()
        print(f"Error creating report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/reports/", response_model=List[schemas.Report])
async def get_reports(
    bbox: schemas.BoundingBox,
    offense_type: Optional[int] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(models.Report)
    
    # Apply bounding box filter using raw SQL for PostGIS
    bbox_filter = f"""
    ST_Within(
        location::geometry,
        ST_MakeEnvelope({bbox.min_lon}, {bbox.min_lat}, {bbox.max_lon}, {bbox.max_lat}, 4326)
    )
    """
    query = query.filter(bbox_filter)
    
    if offense_type is not None:
        query = query.filter(models.Report.offense_type_id == offense_type)
    
    if active_only:
        query = query.filter(
            models.Report.is_active == True,
            models.Report.expires_at > datetime.utcnow()
        )
    
    return query.all()

@app.put("/reports/{report_id}/confirm")
async def confirm_report(
    report_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    client_ip = request.client.host
    if not rate_limiter.can_make_request(client_ip):
        raise HTTPException(status_code=429, detail="Too many requests")
    
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report.confirmation_count += 1
    db.commit()
    
    await ws_manager.broadcast_confirmation(report)
    return {"status": "success"}

@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    bbox: Optional[str] = None
):
    await ws_manager.connect(websocket, bbox)
    try:
        while True:
            await websocket.send_text(json.dumps({"type": "heartbeat"}))
            await asyncio.sleep(30)
    except:
        await ws_manager.disconnect(websocket)

@app.get("/electoral-offenses/", response_model=List[schemas.ElectoralOffense])
def get_electoral_offenses(db: Session = Depends(get_db)):
    return db.query(models.ElectoralOffense).all()