import json
import requests
from concurrent.futures import ThreadPoolExecutor

USERNAME = "SomanAbbasi"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

# Load dataset
with open("wmn-data.json", encoding="utf-8") as f:
    data = json.load(f)

def check_site(site):
    url = site["uri_check"].replace("{account}", USERNAME)
    e_code = site.get("e_code")
    e_string = site.get("e_string", "")
    m_code = site.get("m_code")
    m_string = site.get("m_string", "")

    try:
        r = requests.get(url, headers=HEADERS, timeout=10, allow_redirects=True)
        # Check if response matches existing account rules
        if r.status_code == e_code:
            if (not e_string or e_string in r.text) and (not m_string or m_string not in r.text):
                return site["name"], url
    except Exception:
        pass
    return None

print(f"[*] Searching for '{USERNAME}' across {len(data['sites'])} platforms...\n")

with ThreadPoolExecutor(max_workers=20) as executor:
    results = executor.map(check_site, data["sites"])
    for res in results:
        if res:
            site_name, profile_url = res
            print(f"[+] Found on {site_name}: {profile_url}")