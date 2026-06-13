from gemini_client import analyze_content


def analyse_message_content(message: dict) -> dict:
    return analyze_content({
        "channel": message.get("channel"),
        "timestamp": message.get("time"),
        "preview": message.get("text"),
        "hours_remaining": message.get("hours_remaining", 72)
    })
