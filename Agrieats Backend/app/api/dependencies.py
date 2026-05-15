from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt
import os
from dotenv import load_dotenv

from app.db.database import get_db
from app.db import models

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "agrieats_super_secret_key_rahasia_banget")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token tidak valid. Silakan login ulang.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_akun: str = payload.get("sub")
        if id_akun is None:
            raise credentials_exception
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token sudah kedaluwarsa. Silakan login ulang.")
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = db.query(models.Akun).filter(models.Akun.id_akun == id_akun).first()
    if user is None:
        raise credentials_exception
        
    return user