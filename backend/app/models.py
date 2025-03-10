from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from geoalchemy2 import Geography
import uuid
from datetime import datetime

Base = declarative_base()

class ElectoralOffense(Base):
    __tablename__ = 'electoral_offenses'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    icon_url = Column(String)

class Report(Base):
    __tablename__ = 'reports'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    offense_type_id = Column(Integer, ForeignKey('electoral_offenses.id'), nullable=False)
    location = Column(Geography(geometry_type='POINT', srid=4326), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    confirmation_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    accuracy = Column(Float)  # GPS accuracy in meters
