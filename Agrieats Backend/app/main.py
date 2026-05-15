from fastapi import FastAPI
from app.db.database import engine, Base
from app.db import models 

from app.api.routes import mahasiswa, auth, umkm

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriEats API",
    description="Backend untuk platform AgriEats IPB",
    version="1.0.0"
)

app.include_router(mahasiswa.router, prefix="/api/mahasiswa", tags=["Mahasiswa"])
app.include_router(auth.router, prefix="/api/auth", tags=["Autentikasi"])
app.include_router(mahasiswa.router, prefix="/api/mahasiswa", tags=["Mahasiswa"])

app.include_router(umkm.router, prefix="/api/umkm", tags=["Penjual / UMKM"])
@app.get("/")
def root():
    return {"status": "Migration Successful"}