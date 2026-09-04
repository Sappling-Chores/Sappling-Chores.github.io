import sys
import os
import traceback
import asyncio
import urllib.parse
import re

import pygetwindow as gw
import requests
from dotenv import load_dotenv
import json 
import time
import numpy as np
import keyboard

sys.stdout.reconfigure(encoding='utf-8')

try:
    import winrt.windows.media.control as wmc
    HAS_WINRT = True
except Exception as e:
    print("WinRT Media Control unavailable:", e)
    HAS_WINRT = False

print(np.__version__)
load_dotenv()

print(os.name)
print(gw.__version__)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GIST_ID = os.getenv("GIST_ID")

_ITUNES_CACHE = {}

def get_itunes_meta(artist, title):
    cache_key = f"{artist}||{title}".lower()
    if cache_key in _ITUNES_CACHE:
        return _ITUNES_CACHE[cache_key]
    
    art_url = ""
    track_url = ""
    preview_url = ""
    try:
        query = f"{artist} {title}".strip()
        url = f"https://itunes.apple.com/search?term={urllib.parse.quote(query)}&media=music&entity=song&limit=1"
        res = requests.get(url, timeout=3)
        if res.status_code == 200:
            data = res.json()
            if data.get("resultCount", 0) > 0:
                item = data["results"][0]
                art = item.get("artworkUrl100", "")
                if art:
                    art_url = art.replace("100x100bb", "600x600bb")
                track_url = item.get("trackViewUrl", "")
                preview_url = item.get("previewUrl", "")
    except Exception as e:
        print("iTunes lookup exception:", e)
        
    _ITUNES_CACHE[cache_key] = (art_url, track_url, preview_url)
    return art_url, track_url, preview_url

_KNOWN_ARTISTS = [
    "JENNIE", "BIBI", "KATSEYE", "BLACKPINK", "ROSE", "ROSÉ", "LISA", "ILLIT", "BTS",
    "Sabrina Carpenter", "Billie Eilish", "Olivia Rodrigo", "Taylor Swift", "xooos",
    "BABYMONSTER", "NewJeans", "LE SSERAFIM", "TWICE", "IVE", "aespa", "Stray Kids",
    "EXO", "SEVENTEEN", "ENHYPEN", "TXT", "Red Velvet", "ITZY", "NMIXX", "GIDLE",
    "(G)I-DLE", "IU", "Taeyeon", "Jungkook", "Jimin", "Agust D", "RM", "JISOO",
    "MEOVV", "KISS OF LIFE", "ZEROBASEONE", "RIIZE", "TWS", "BOYNEXTDOOR",
    "Ariana Grande", "The Weeknd", "Dua Lipa", "Doja Cat", "Lana Del Rey", "Bruno Mars",
    "Ed Sheeran", "Justin Bieber", "Harry Styles", "Rihanna", "Lady Gaga", "Katy Perry",
    "Selena Gomez", "SZA", "Mitski", "Charli XCX", "Chappell Roan", "Post Malone",
    "Drake", "Travis Scott", "Kendrick Lamar", "Eminem", "Imagine Dragons", "Coldplay",
    "One Direction", "Arctic Monkeys", "Cigarettes After Sex", "TV Girl", "Laufey", "Conan Gray"
]

def clean_media_title_artist(raw_title, raw_artist):
    title = raw_title.strip()
    artist = raw_artist.strip()
    
    clean_title = re.sub(r'[\(\[\{](official|music|video|lyric|audio|hd|4k|mv|performance).*?[\)\]\}]', '', title, flags=re.IGNORECASE).strip()
    
    is_generic_artist = (not artist) or (artist.lower() in ["youtube", "chrome", "msedge", "firefox", "brave", "unknown artist", "unknown", "hybe labels", "smtown", "jyp entertainment", "yg entertainment"])
    
    if is_generic_artist:
        if " - " in clean_title:
            parts = clean_title.split(" - ", 1)
            artist = parts[0].strip()
            title = parts[1].strip()
        elif " – " in clean_title:
            parts = clean_title.split(" – ", 1)
            artist = parts[0].strip()
            title = parts[1].strip()
        else:
            for m_art in _KNOWN_ARTISTS:
                if m_art.lower() in clean_title.lower():
                    artist = m_art
                    break

    if (title.startswith("'") and title.endswith("'")) or (title.startswith('"') and title.endswith('"')):
        title = title[1:-1].strip()

    return artist, title

async def get_smtc_b64_thumbnail(props):
    if not props or not props.thumbnail:
        return ""
    try:
        import winrt.windows.storage.streams as streams
        stream = await props.thumbnail.open_read_async()
        size = stream.size
        if size == 0:
            return ""
        reader = streams.DataReader(stream)
        await reader.load_async(size)
        buffer = bytearray(size)
        reader.read_bytes(buffer)
        b64 = base64.b64encode(buffer).decode("utf-8")
        return f"data:image/jpeg;base64,{b64}"
    except Exception as e:
        print("SMTC b64 thumbnail exception:", e)
        return ""

async def fetch_media_payload_async(last_music=None):
    if not HAS_WINRT:
        if last_music:
            last_music["isPlaying"] = False
        return last_music
    
    try:
        manager = await wmc.GlobalSystemMediaTransportControlsSessionManager.request_async()
        sessions = manager.get_sessions()
        
        target_session = None
        for s in sessions:
            info = s.get_playback_info()
            if info and info.playback_status == 4:
                target_session = s
                break
                
        if not target_session:
            target_session = manager.get_current_session()
            
        if not target_session:
            if last_music:
                last_music["isPlaying"] = False
                return last_music
            return None
        
        playback = target_session.get_playback_info()
        status_code = playback.playback_status if playback else 0
        is_playing = (status_code == 4)
        
        props = await target_session.try_get_media_properties_async()
        raw_title = props.title.strip() if props and props.title else ""
        raw_artist = props.artist.strip() if props and props.artist else ""
        album = props.album_title.strip() if props and props.album_title else ""
        
        if not raw_title and not raw_artist:
            if last_music:
                last_music["isPlaying"] = False
                return last_music
            return None
        
        artist, title = clean_media_title_artist(raw_title, raw_artist)
        
        timeline = target_session.get_timeline_properties()
        position = 0
        duration = 0
        if timeline:
            if hasattr(timeline.position, "total_seconds"):
                position = int(timeline.position.total_seconds())
            if hasattr(timeline.end_time, "total_seconds"):
                duration = int(timeline.end_time.total_seconds())
                
        app_id = target_session.source_app_user_model_id.lower() if target_session.source_app_user_model_id else ""
        
        art_url, track_url, preview_url = get_itunes_meta(artist, title)
        
        if not art_url:
            art_url = await get_smtc_b64_thumbnail(props)
        
        if not track_url:
            q = urllib.parse.quote(f"{artist} {title}".strip())
            if "spotify" in app_id:
                track_url = f"https://open.spotify.com/search/{q}"
            else:
                track_url = f"https://www.youtube.com/results?search_query={q}"
                
        music_data = {
            "title": title or "Unknown Track",
            "artist": artist or "Unknown Artist",
            "album": album,
            "thumbnail": art_url,
            "link": track_url,
            "audioPreview": preview_url,
            "isPlaying": is_playing,
            "position": position,
            "duration": duration,
            "app": "spotify" if "spotify" in app_id else ("youtube" if "youtube" in app_id or "chrome" in app_id else "media"),
            "updatedAt": int(time.time())
        }
        return music_data
    except Exception as e:
        print("Media fetch error:", e)
        if last_music:
            last_music["isPlaying"] = False
            return last_music
        return None

def fetch_media_payload(last_music=None):
    try:
        return asyncio.run(fetch_media_payload_async(last_music))
    except Exception as e:
        print("fetch_media_payload wrapper error:", e)
        if last_music:
            last_music["isPlaying"] = False
        return last_music

def update_gist(status_text, music_artist="", music_data=None):
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }
    payload = {
        "status": status_text,
        "musicArtist": music_artist
    }
    if music_data:
        payload["music"] = music_data

    data = {
        "files": {
            "status.json": {
                "content": json.dumps(payload, indent=2)
            }
        }
    }
    try:
        requests.patch(f"https://api.github.com/gists/{GIST_ID}", headers=headers, json=data)
    except Exception as e:
        print(f"Error updating gist: {e}")

def monitor_active_window():
    print("Monitoring active windows... (Press Ctrl+Shift+Q to stop silently from anywhere)")
    musicArtist = [
        "JENNIE", "BIBI", "KATSEYE", "BLACKPINK", "ROSE", "ROSÉ", "LISA", "ILLIT", "BTS",
        "Sabrina Carpenter", "Billie Eilish", "Olivia Rodrigo", "Taylor Swift", "xooos",
        "BABYMONSTER", "NewJeans", "LE SSERAFIM", "TWICE", "IVE", "aespa", "Stray Kids",
        "EXO", "SEVENTEEN", "ENHYPEN", "TXT", "Red Velvet", "ITZY", "NMIXX", "GIDLE",
        "(G)I-DLE", "IU", "Taeyeon", "Jungkook", "Jimin", "Agust D", "RM", "JISOO",
        "MEOVV", "KISS OF LIFE", "ZEROBASEONE", "RIIZE", "TWS", "BOYNEXTDOOR",
        "Ariana Grande", "The Weeknd", "Dua Lipa", "Doja Cat", "Lana Del Rey", "Bruno Mars",
        "Ed Sheeran", "Justin Bieber", "Harry Styles", "Rihanna", "Lady Gaga", "Katy Perry",
        "Selena Gomez", "SZA", "Mitski", "Charli XCX", "Chappell Roan", "Post Malone",
        "Drake", "Travis Scott", "Kendrick Lamar", "Eminem", "Imagine Dragons", "Coldplay",
        "One Direction", "Arctic Monkeys", "Cigarettes After Sex", "TV Girl", "Laufey", "Conan Gray"
    ]
    current_window = None
    last_music = None

    try:
        while True:
            if keyboard.is_pressed('ctrl+shift+q'):
                if last_music:
                    last_music["isPlaying"] = False
                update_gist("Offline", "", last_music)
                print("\nMonitoring stopped via hotkey.")
                break

            new_window = gw.getActiveWindowTitle()
            media_info = fetch_media_payload(last_music)
            if media_info:
                last_music = media_info

            status_text = "Online"
            artist_name = ""

            if media_info and media_info.get("isPlaying"):
                artist_name = media_info.get("artist", "")

            if new_window:
                current_window = new_window
                if "Autodesk Fusion" in current_window:
                    status_text = "Fusion-360"
                elif "YouTube" in current_window and not any(artist in current_window for artist in musicArtist):
                    status_text = "YouTube"
                elif "Code" in current_window or "Cursor" in current_window:
                    status_text = "Code"
                elif "KiCad 9.0" in current_window: 
                    status_text = "KiCad"
                elif any(artist in current_window for artist in musicArtist):
                    status_text = "Online"
                    common = [artist for artist in musicArtist if artist in current_window]
                    artist_name = common[0]
                elif "Physics Wallah" in current_window or "PW Video Player" in current_window: 
                    status_text = "Study"
                elif "Chrome" in current_window and not "YouTube" in current_window: 
                    status_text = "Chrome"

            print(f"Updating Gist -> Status: {status_text}, Music: {last_music.get('title') if last_music else 'None'} (playing: {last_music.get('isPlaying') if last_music else False})")
            update_gist(status_text, artist_name, last_music)

            time.sleep(15) 

    except KeyboardInterrupt:
        if last_music:
            last_music["isPlaying"] = False
        update_gist("Offline", "", last_music)
        print("\nMonitoring stopped.")

if __name__ == "__main__":
    monitor_active_window()
