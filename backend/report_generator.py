from gemini_client import generate_report


def create_forensic_report(centre: dict, national_avg: float) -> str:
    return generate_report(centre, national_avg)
