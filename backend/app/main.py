from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import httpx
import stripe
from jose import JWTError, jwt
from passlib.context import CryptContext

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# JWT
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

# Mock database
db = {
    "users": {},
    "integrations": {},
}

class User(BaseModel):
    id: str
    name: str
    email: str
    plan: str = "free"

class IntegrationToggle(BaseModel):
    service: str
    userId: str

@app.get("/")
def read_root():
    return {"message": "MetaIA API"}

@app.get("/integrations")
async def list_integrations(userId: str):
    return db["integrations"].get(userId, {})

@app.post("/integrations/toggle")
async def toggle_integration(data: IntegrationToggle):
    user_integrations = db["integrations"].get(data.userId, {})
    user_integrations[data.service] = not user_integrations.get(data.service, False)
    db["integrations"][data.userId] = user_integrations
    return user_integrations

@app.post("/stripe/checkout")
async def create_checkout_session(planId: str):
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{"price": planId, "quantity": 1}],
        mode="subscription",
        success_url="http://localhost:3000/dashboard?session_id={CHECKOUT_SESSION_ID}",
        cancel_url="http://localhost:3000/pricing",
    )
    return {"id": session.id}
