import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from cryptography.fernet import Fernet

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"])

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

cipher = Fernet(os.getenv("ENCRYPTION_KEY","").encode())

def encode(data: str) -> str:
    return cipher.encrypt(data.encode()).decode()

def decode(token: str) -> str:
    return cipher.decrypt(token.encode()).decode()