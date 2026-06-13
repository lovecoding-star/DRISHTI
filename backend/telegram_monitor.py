import os
import asyncio
import random
from datetime import datetime
from dotenv import load_dotenv
from telethon import TelegramClient, events

load_dotenv()
TELEGRAM_API_ID = os.getenv("TELEGRAM_API_ID")
TELEGRAM_API_HASH = os.getenv("TELEGRAM_API_HASH")
TELEGRAM_PHONE = os.getenv("TELEGRAM_PHONE")

DEMO_MODE = not (TELEGRAM_API_ID and TELEGRAM_API_HASH and TELEGRAM_PHONE)
WATCH_CHANNELS = [
    "NEET 2027 Aspirants",
    "Medical Entrance Updates",
    "Competitive Exam Hub"
]

SIMULATION_MESSAGES = [
    ("NEET 2027 Aspirants", "Anyone solved yesterday's mock paper?"),
    ("NEET 2027 Aspirants", "Physics section was tough today"),
    ("NEET 2027 Aspirants", "Which coaching for organic chemistry?"),
    ("Medical Entrance Updates", "NTA released admit card notice"),
    ("Competitive Exam Hub", "Good luck for tomorrow's exam"),
    ("NEET 2027 Aspirants", "[PDF] NEET_2026_Final_Questions.pdf — 4.2 MB"),
    ("NEET 2027 Aspirants", "sharing for revision purposes only")
]


async def _run_demo_sequence(on_message, on_alert):
    await on_message({"channel": WATCH_CHANNELS[0], "text": SIMULATION_MESSAGES[0][1], "time": datetime.utcnow().isoformat()})
    await asyncio.sleep(1.0)
    await on_message({"channel": WATCH_CHANNELS[0], "text": SIMULATION_MESSAGES[1][1], "time": datetime.utcnow().isoformat()})
    await asyncio.sleep(1.0)
    await on_message({"channel": WATCH_CHANNELS[0], "text": SIMULATION_MESSAGES[2][1], "time": datetime.utcnow().isoformat()})
    await asyncio.sleep(1.0)
    await on_message({"channel": WATCH_CHANNELS[1], "text": SIMULATION_MESSAGES[3][1], "time": datetime.utcnow().isoformat()})
    await asyncio.sleep(1.0)
    await on_message({"channel": WATCH_CHANNELS[2], "text": SIMULATION_MESSAGES[4][1], "time": datetime.utcnow().isoformat()})
    await asyncio.sleep(1.0)
    payload = {
        "channel": WATCH_CHANNELS[0],
        "text": SIMULATION_MESSAGES[5][1],
        "time": datetime.utcnow().isoformat()
    }
    await on_message(payload)
    await asyncio.sleep(1.0)
    analysis = {
        "channel": payload["channel"],
        "timestamp": payload["time"],
        "preview": payload["text"],
        "hours_remaining": 72
    }
    await asyncio.sleep(1.0)
    await on_alert(analysis)


async def run_simulation(on_message, on_alert):
    if DEMO_MODE:
        await _run_demo_sequence(on_message, on_alert)
        return {"mode": "DEMO", "status": "SIMULATED"}
    client = TelegramClient("drishti_session", int(TELEGRAM_API_ID), TELEGRAM_API_HASH)
    await client.start(phone=TELEGRAM_PHONE)

    @client.on(events.NewMessage(chats=WATCH_CHANNELS))
    async def handler(event):
        message = event.message.message
        channel = getattr(event.chat, "title", "Telegram Monitor")
        await on_message({"channel": channel, "text": message, "time": datetime.utcnow().isoformat()})
        if "pdf" in message.lower() or "neet" in message.lower():
            analysis = {
                "channel": channel,
                "timestamp": datetime.utcnow().isoformat(),
                "preview": message,
                "hours_remaining": 72
            }
            await on_alert(analysis)

    await client.run_until_disconnected()
    return {"mode": "LIVE", "status": "CONNECTED"}


def get_watch_status():
    return {
        "demo_mode": DEMO_MODE,
        "channels": WATCH_CHANNELS,
        "active": False if DEMO_MODE else True
    }
