from fastapi import WebSocket
from typing import Dict, Set, Optional
import json
import asyncio

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[WebSocket, Optional[str]] = {}
        
    async def connect(self, websocket: WebSocket, bbox: Optional[str] = None):
        await websocket.accept()
        self.active_connections[websocket] = bbox

    async def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            del self.active_connections[websocket]

    async def broadcast_report(self, report):
        try:
            location_str = str(report.location)
            coords = location_str.replace('POINT(', '').replace(')', '').split()
            longitude, latitude = map(float, coords)
        except (ValueError, IndexError):
            longitude, latitude = 0.0, 0.0

        report_data = {
            "type": "new_report",
            "data": {
                "id": str(report.id),
                "offense_type_id": report.offense_type_id,
                "coordinates": {
                    "longitude": longitude,
                    "latitude": latitude,
                    "accuracy": report.accuracy
                },
                "created_at": report.created_at.isoformat(),
                "expires_at": report.expires_at.isoformat(),
                "confirmation_count": report.confirmation_count
            }
        }
        
        await self._broadcast(json.dumps(report_data))

    async def broadcast_confirmation(self, report):
        confirmation_data = {
            "type": "confirmation_update",
            "data": {
                "report_id": str(report.id),
                "confirmation_count": report.confirmation_count
            }
        }
        
        await self._broadcast(json.dumps(confirmation_data))

    async def _broadcast(self, message: str):
        disconnected = []
        for websocket in self.active_connections:
            try:
                await websocket.send_text(message)
            except:
                disconnected.append(websocket)
        
        # Clean up disconnected websockets
        for websocket in disconnected:
            await self.disconnect(websocket)