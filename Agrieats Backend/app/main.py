from fastapi import FastAPI
from app.db.database import engine, Base
from app.db import models 
from app.api.routes import mahasiswa, auth, umkm, menu
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriEats API",
    description="Backend untuk platform AgriEats IPB",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      
    allow_headers=["*"],
)

app.include_router(mahasiswa.router, prefix="/api/mahasiswa", tags=["Mahasiswa"])
app.include_router(auth.router, prefix="/api/auth", tags=["Autentikasi"])
# app.include_router(mahasiswa.router, prefix="/api/mahasiswa", tags=["Mahasiswa"])

app.include_router(umkm.router, prefix="/api/umkm", tags=["Penjual / UMKM"])
app.include_router(menu.router, prefix="/api/menu", tags=["Katalog Menu"])
@app.get("/")
def root():
    return {"status": "Migration Successful"}