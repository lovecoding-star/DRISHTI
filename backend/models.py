from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

class AlertCreate(BaseModel):
    channel_name: str
    threat_level: str
    confidence: float
    risk_score: float
    content_type: str
    reasoning: str
    recommended_action: str
    cluster_score: float
    propagation_score: float

class AlertOut(AlertCreate):
    id: int
    timestamp: datetime
    status: str

    class Config:
        orm_mode = True

class CentreSummary(BaseModel):
    centre_code: str
    centre_name: str
    city: str
    state: str
    total_candidates: int
    above_600_pct: float
    anomaly_multiplier: float
    fraud_risk_score: float
    risk_level: str

class CentreDetail(CentreSummary):
    above_400: int
    above_500: int
    above_700: int
    perfect_720: int
    average_score: float
    historical_note: str

class StateSummary(BaseModel):
    state: str
    flagged_centres: int
    average_risk: float
    top_alerts: int

class HealthResponse(BaseModel):
    status: str
    mode: str
    centres: int
