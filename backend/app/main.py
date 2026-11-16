import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .database import init_db
from .seed_data import seed_database
from .routes import inventory, buyback, bundles, billing, analytics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database schema is ready and seed books exist
    init_db()
    seed_database()
    yield

app = FastAPI(
    title="Pustak Smart Bookstore API",
    description="Full-stack API for circular textbook buyback, physical shelf navigation, syllabus bundles, POS billing, and dead stock AI.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-routers
app.include_router(inventory.router)
app.include_router(buyback.router)
app.include_router(bundles.router)
app.include_router(billing.router)
app.include_router(analytics.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "project": "Pustak — Smart Bookstore & Circular Inventory Management System",
        "developer": {
            "name": "Nikita Sharad Pawar",
            "prn": "202401100018"
        },
        "docs_url": "/docs"
    }

# Mount static frontend build if present
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="Endpoint not found")
        index_file = os.path.join(frontend_dist, "index.html")
        return FileResponse(index_file)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
