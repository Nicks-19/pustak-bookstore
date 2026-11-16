import os
import sys

# Add project root to sys.path so backend package can be imported
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app.database import init_db
from backend.app.seed_data import seed_database

# Initialize database schema and ensure seeds exist in serverless environment
try:
    init_db()
    seed_database()
except Exception as e:
    print(f"Serverless init notice: {e}")

from backend.app.main import app
