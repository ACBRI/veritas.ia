from pydantic import BaseModel, UUID4, Field, validator
from typing import Optional, List
from datetime import datetime
import re

class ElectoralOffenseBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon_url: Optional[str] = None

class ElectoralOffenseCreate(ElectoralOffenseBase):
    pass

class ElectoralOffense(ElectoralOffenseBase):
    id: int

    class Config:
        from_attributes = True

class Coordinates(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    accuracy: Optional[float] = None

class ReportCreate(BaseModel):
    offense_type_id: int
    coordinates: Coordinates

class Report(BaseModel):
    id: UUID4
    offense_type_id: int
    location: str
    created_at: datetime
    expires_at: datetime
    confirmation_count: int
    is_active: bool
    accuracy: Optional[float] = None

    @property
    def coordinates(self) -> Coordinates:
        # Extract coordinates from PostGIS format
        pattern = r'POINT\(([-\d.]+) ([-\d.]+)\)'
        match = re.search(pattern, str(self.location))
        if match:
            lon, lat = map(float, match.groups())
            return Coordinates(latitude=lat, longitude=lon, accuracy=self.accuracy)
        return None

    class Config:
        from_attributes = True

class BoundingBox(BaseModel):
    min_lat: float = Field(..., ge=-90, le=90)
    min_lon: float = Field(..., ge=-180, le=180)
    max_lat: float = Field(..., ge=-90, le=90)
    max_lon: float = Field(..., ge=-180, le=180)

    @validator('max_lat')
    def max_lat_must_be_greater(cls, v, values):
        if 'min_lat' in values and v <= values['min_lat']:
            raise ValueError('max_lat must be greater than min_lat')
        return v

    @validator('max_lon')
    def max_lon_must_be_greater(cls, v, values):
        if 'min_lon' in values and v <= values['min_lon']:
            raise ValueError('max_lon must be greater than min_lon')
        return v