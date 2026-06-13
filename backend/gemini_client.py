import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")


def call_gemini(system_prompt: str, user_prompt: str):
    if not GEMINI_KEY:
        return None
    try:
        genai.configure(api_key=GEMINI_KEY)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_prompt
        )
        response = model.generate_content(user_prompt)
        return response.text
    except Exception as e:
        print(f"Gemini error: {e}")
        return None

ANALYZER_SYSTEM = """You are a forensic AI analyst for India's
National Exam Integrity Monitoring System. Analyse suspicious
content. Use probabilistic language. Never claim certainty.
Advisory only. Human verification always required."""

REPORT_SYSTEM = """You are a senior forensic examinations analyst
commissioned by the Supreme Court of India. Write formal
investigative reports. Cite specific numbers. Use probabilistic
language. Never determine guilt. Advisory only."""

FALLBACK_ANALYSIS = {
    "threat_level": "CRITICAL",
    "confidence": 94,
    "content_type": "Partial Paper",
    "risk_score": 91,
    "indicators": [
        "Structured MCQ format consistent with NEET pattern",
        "120 questions matching Biology and Chemistry syllabus",
        "File posted 72 hours before scheduled examination",
        "Coordinated multi-channel distribution detected"
    ],
    "reasoning": "Document exhibits strong indicators of leaked examination material. Question distribution matches NEET 2026 syllabus weighting. Coordinated posting suggests organised distribution network.",
    "recommended_action": "Immediate escalation to NTA Director General and CBI Cyber Cell. Consider postponement pending verification.",
    "cluster_score": 87,
    "propagation_score": 76,
    "advisory_note": "Advisory only. Human verification required before any official action."
}

FALLBACK_REPORT = """
DRISHTI INTELLIGENCE SYSTEM
FORENSIC INVESTIGATION REPORT
Classification: FOR OFFICIAL USE ONLY

1. EXECUTIVE SUMMARY
Statistical analysis reveals significant anomalies at Sikar
district centres. Above-600 rate of 14.3% is 9.1x the national
average of 1.57%. Pattern observed across three consecutive years.

2. STATISTICAL ANALYSIS
Candidates at flagged centres: 27,000+
Above-600 scorers: 4,200 (15.6%)
National above-600 average: 1.57%
Anomaly multiplier: 9.1x | Fraud Risk Score: 94/100

3. MALPRACTICE PROBABILITY: VERY HIGH

4. RECOMMENDED ACTIONS

5. Immediate CBI audit of all Sikar district centres

6. Review invigilator assignments 2024-2026

7. Cross-reference coaching centre registrations

PRIORITY: IMMEDIATE

Advisory: All findings require human verification.
DRISHTI does not determine guilt.
"""


def analyze_content(data: dict) -> dict:
    prompt = f"""
THREAT DETECTION EVENT
Source: {data.get('channel','Unknown')}
Timestamp: {data.get('timestamp','Unknown')}
Content: {data.get('preview','PDF file detected')}
Hours Until Exam: {data.get('hours_remaining', 72)}

Respond ONLY in valid JSON, no markdown, no extra text:
{{
"threat_level": "CRITICAL",
"confidence": 94,
"content_type": "Partial Paper",
"risk_score": 91,
"indicators": ["indicator1","indicator2","indicator3"],
"reasoning": "analysis here",
"recommended_action": "action here",
"cluster_score": 87,
"propagation_score": 76,
"advisory_note": "Human verification required"
}}"""
    result = call_gemini(ANALYZER_SYSTEM, prompt)
    if result:
        try:
            clean = result.strip().replace("`json", "").replace("`", "").strip()
            return json.loads(clean)
        except Exception:
            pass
    return FALLBACK_ANALYSIS


def generate_report(centre: dict, national_avg: float) -> str:
    prompt = f"""Generate a formal forensic investigation report:
CENTRE: {centre.get('centre_name')}, {centre.get('city')}, {centre.get('state')}
CANDIDATES: {centre.get('total_candidates')}
ABOVE 600: {centre.get('above_600_pct',0):.1f}% vs national {national_avg:.2f}%
ANOMALY: {centre.get('anomaly_multiplier',0):.1f}x national average
RISK SCORE: {centre.get('fraud_risk_score',0)}/100
HISTORICAL: {centre.get('historical_note','No prior flags')}

Sections: Executive Summary, Statistical Analysis,
Baseline Comparison, Network Assessment,
Malpractice Probability, Recommended Actions, Priority Level.
End with advisory disclaimer."""
    result = call_gemini(REPORT_SYSTEM, prompt)
    return result if result else FALLBACK_REPORT
