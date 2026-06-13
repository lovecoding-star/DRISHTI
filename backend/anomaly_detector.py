import numpy as np
import pandas as pd


def calculate_anomalies(centres: list) -> pd.DataFrame:
    df = pd.DataFrame(centres)
    df["above_600_pct"] = df["above_600_pct"].astype(float)
    national_avg = float(df["above_600_pct"].mean())
    national_std = float(df["above_600_pct"].std(ddof=0)) or 0.01
    df["anomaly_multiplier"] = df["above_600_pct"] / national_avg
    df["z_score"] = (df["above_600_pct"] - national_avg) / national_std
    df["above_700_pct"] = np.where(df["total_candidates"] > 0, df["above_700"] / df["total_candidates"] * 100, 0.0)
    df["perfect_720"] = df["perfect_720"].astype(int)
    df["fraud_risk_score"] = df.apply(_compute_risk_score, axis=1)
    df["risk_level"] = df["fraud_risk_score"].apply(_map_risk_level)
    df["above_600_pct"] = df["above_600_pct"].round(2)
    df["anomaly_multiplier"] = df["anomaly_multiplier"].round(2)
    df["fraud_risk_score"] = df["fraud_risk_score"].round(1)
    return df


def _compute_risk_score(row) -> float:
    z_component = min(max(row["z_score"], 0) * 15, 40)
    perfect_component = min(row["perfect_720"] * 3, 30)
    above700_component = min(row["above_700_pct"] * 10, 20)
    risk = z_component + perfect_component + above700_component
    return float(min(max(risk, 0), 100))


def _map_risk_level(score: float) -> str:
    if score >= 70:
        return "CRITICAL"
    if score >= 50:
        return "HIGH"
    if score >= 30:
        return "MEDIUM"
    return "LOW"


def get_summary(df: pd.DataFrame) -> dict:
    total_centres = len(df)
    critical = int((df["risk_level"] == "CRITICAL").sum())
    high = int((df["risk_level"] == "HIGH").sum())
    threats = int((df["anomaly_multiplier"] >= 2).sum())
    states_flagged = int(df[df["risk_level"].isin(["CRITICAL", "HIGH"])]["state"].nunique())
    candidates = int(df["total_candidates"].sum())
    top_centres = df.sort_values(["fraud_risk_score", "above_600_pct"], ascending=False).head(5)
    return {
        "total_centres": total_centres,
        "critical_centres": critical,
        "high_centres": high,
        "threats_detected": threats,
        "states_flagged": states_flagged,
        "candidates_affected": candidates,
        "top_centres": top_centres.to_dict(orient="records")
    }


def get_centre_by_code(df: pd.DataFrame, code: str) -> dict:
    row = df[df["centre_code"] == code]
    return row.iloc[0].to_dict() if not row.empty else {}


def filter_centres(df: pd.DataFrame, level: str = None, state: str = None, query: str = None) -> list:
    result = df.copy()
    if level and level != "ALL":
        result = result[result["risk_level"] == level]
    if state and state != "ALL":
        result = result[result["state"] == state]
    if query:
        query = query.lower()
        result = result[result["centre_name"].str.lower().str.contains(query) | result["city"].str.lower().str.contains(query) | result["state"].str.lower().str.contains(query)]
    return result.sort_values(["fraud_risk_score", "above_600_pct"], ascending=False).to_dict(orient="records")
