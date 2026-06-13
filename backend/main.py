from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import os
from dotenv import load_dotenv
from database import init_db, get_db, AlertDB
from data_loader import load_centre_data
from anomaly_detector import calculate_anomalies, get_summary, get_centre_by_code, filter_centres
from gemini_client import analyze_content
from telegram_monitor import run_simulation, get_watch_status, DEMO_MODE
from correlation_engine import build_graph
from alert_engine import build_alert_payload, save_alert, serialize_alert
from report_generator import create_forensic_report
from sqlalchemy.orm import Session
from typing import Optional

load_dotenv()

app = FastAPI(title="DRISHTI", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients = []
watchdog_state = {"active": False, "last_event": None}


def json_error(message: str, status_code: int = 400):
    return JSONResponse(status_code=status_code, content={"error": message})


@app.on_event("startup")
async def startup():
    init_db()
    centres = load_centre_data()
    global df
    df = calculate_anomalies(centres)
    print("DRISHTI ready on http://localhost:8000")


@app.websocket("/ws/alerts")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    connected_clients.append(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        if ws in connected_clients:
            connected_clients.remove(ws)


async def broadcast(message: dict):
    for client in connected_clients:
        try:
            await client.send_json(message)
        except Exception:
            pass


@app.get("/api/health")
async def health():
    mode = "DEMO" if DEMO_MODE else "LIVE"
    return {"status": "ok", "mode": mode, "centres": len(df)}


@app.get("/api/summary")
async def summary():
    stats = get_summary(df)
    return {
        "status": "ok",
        "summary": {
            "centreCount": stats["total_centres"],
            "criticalAlerts": stats["critical_centres"],
            "highRiskCentres": stats["high_centres"],
            "threatsDetected": stats["threats_detected"],
            "statesFlagged": stats["states_flagged"],
            "candidatesAffected": stats["candidates_affected"],
            "topCentres": stats["top_centres"]
        }
    }


@app.get("/api/centres")
async def centres(level: Optional[str] = Query("ALL"), state: Optional[str] = Query("ALL"), q: Optional[str] = Query(None)):
    try:
        centre_list = filter_centres(df, level, state, q)
        return {"status": "ok", "centres": centre_list}
    except Exception as exc:
        return json_error(str(exc), 500)


@app.get("/api/centres/{code}")
async def centre_detail(code: str):
    centre = get_centre_by_code(df, code)
    if not centre:
        return json_error("Centre not found", 404)
    return {"status": "ok", "centre": centre}


@app.get("/api/centres/{code}/report")
async def centre_report(code: str):
    centre = get_centre_by_code(df, code)
    if not centre:
        return json_error("Centre not found", 404)
    national_avg = float(df["above_600_pct"].mean())
    report_text = create_forensic_report(centre, national_avg)
    return {"status": "ok", "report": report_text}


@app.get("/api/states")
async def states():
    grouped = df.groupby("state").agg({"fraud_risk_score": "mean", "centre_code": "count"}).reset_index()
    payload = []
    for _, row in grouped.iterrows():
        payload.append({
            "state": row["state"],
            "flaggedCentres": int(row["centre_code"]),
            "averageRisk": round(float(row["fraud_risk_score"]), 1),
            "topAlerts": 0
        })
    return {"status": "ok", "states": payload}


@app.get("/api/search")
async def search(q: str = Query(None)):
    if not q:
        return {"status": "ok", "results": []}
    results = filter_centres(df, None, None, q)
    return {"status": "ok", "results": results}


@app.get("/api/watchdog/status")
async def watchdog_status():
    status = get_watch_status()
    return {"status": "ok", "watchdog": status}


@app.post("/api/watchdog/simulate")
async def watchdog_simulate(db: Session = Depends(get_db)):
    async def on_message(data: dict):
        watchdog_state["last_event"] = data
        await broadcast({"type": "watchdog_message", "payload": data})

    async def on_alert(message: dict):
        analysis = analyze_content(message)
        payload = build_alert_payload(analysis)
        saved = save_alert(db, payload)
        alert_data = serialize_alert(saved)
        await broadcast({"type": "alert", "payload": alert_data})

    result = await run_simulation(on_message, on_alert)
    return {"status": "ok", "result": result}


@app.get("/api/graph")
async def graph(db: Session = Depends(get_db)):
    alerts = db.query(AlertDB).order_by(AlertDB.id.desc()).limit(20).all()
    centre_records = df.sort_values(["fraud_risk_score"], ascending=False).head(40).to_dict(orient="records")
    return {"status": "ok", "graph": build_graph(centre_records, [serialize_alert(a) for a in alerts])}


@app.get("/api/alerts")
async def alerts(db: Session = Depends(get_db)):
    alert_records = db.query(AlertDB).order_by(AlertDB.id.desc()).limit(20).all()
    payload = [serialize_alert(alert) for alert in alert_records]
    return {"status": "ok", "alerts": payload}
