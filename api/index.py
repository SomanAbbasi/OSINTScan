import sys
from pathlib import Path

# Ensure repository root is on sys.path for Vercel Serverless runtime
repo_root = Path(__file__).resolve().parent.parent
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

from backend.app.main import app
