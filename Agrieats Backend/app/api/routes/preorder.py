from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas import user
from app.crud import crud_user
from app.api.dependencies import get_current_user
from app.db import models

router = APIRouter()

@router.post("/order", response_model=user.UmkmResponse, status_code=status.HTTP_201_CREATED)
def make_preorder():
    pass