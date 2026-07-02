from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr


# ---------- Config ----------
mongo_url = os.environ['MONGO_URL']
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
JWT_ALG = 'HS256'
ACCESS_TTL_MIN = 60 * 24  # 24 hours for admin convenience
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@example.com').lower()
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Avani Manoria Portfolio API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ---------- Auth helpers ----------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": "admin",
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TTL_MIN),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


security = HTTPBearer(auto_error=False)


async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("role") != "admin" or payload.get("type") != "access":
        raise HTTPException(status_code=403, detail="Admin only")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------- Models ----------
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: Optional[str] = Field(default=None, max_length=200)
    message: str = Field(min_length=1, max_length=4000)


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False


class Socials(BaseModel):
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    twitter: Optional[str] = ""
    writing: Optional[str] = ""


class HeroMeta(BaseModel):
    based_in: Optional[str] = "India · Remote"
    focus: Optional[str] = "Full-stack · ML · AI"
    experience: Optional[str] = "Final Year · Engineering"
    status: Optional[str] = "Open to opportunities"


class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "singleton"
    name: str
    tagline: str
    bio_paragraph_1: str
    bio_paragraph_2: str
    philosophy_quote: str
    contact_email: str
    availability: str
    socials: Socials
    hero_meta: HeroMeta
    stats_shipped: str = "3"
    stats_regions: str = "1"
    stats_automations: str = "∞"


class SettingsUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    bio_paragraph_1: Optional[str] = None
    bio_paragraph_2: Optional[str] = None
    philosophy_quote: Optional[str] = None
    contact_email: Optional[str] = None
    availability: Optional[str] = None
    socials: Optional[Socials] = None
    hero_meta: Optional[HeroMeta] = None
    stats_shipped: Optional[str] = None
    stats_regions: Optional[str] = None
    stats_automations: Optional[str] = None


class ProjectIn(BaseModel):
    kind: str
    year: str
    title: str
    blurb: str
    stack: List[str] = []
    image_url: Optional[str] = ""
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""
    order: int = 0


class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    kind: str
    year: str
    title: str
    blurb: str
    stack: List[str] = []
    image_url: Optional[str] = ""
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""
    order: int = 0


class EducationIn(BaseModel):
    period: str
    degree: str
    institution: str
    notes: List[str] = []
    order: int = 0


class Education(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    period: str
    degree: str
    institution: str
    notes: List[str] = []
    order: int = 0


# ---------- Seed defaults ----------
DEFAULT_SETTINGS = {
    "id": "singleton",
    "name": "Avani Manoria",
    "tagline": "engineering the quiet elegance behind intelligent systems.",
    "bio_paragraph_1": "I'm a final-year engineering student working at the intersection of full-stack software, applied machine learning, and thoughtful AI systems. I care about the parts of engineering that are invisible when they work — clean interfaces, honest APIs, models that fail gracefully.",
    "bio_paragraph_2": "My favourite problems are the ones that feel messy at first — a workflow no one has bothered to formalise, a dataset that hides a pattern, a UI that could feel a little more alive. I like turning those into things that are calm, considered, and quietly delightful.",
    "philosophy_quote": "Great systems are not built loud. They're built listening.",
    "contact_email": "avanimanoria@gmail.com",
    "availability": "Open to work",
    "socials": {
        "linkedin": "https://linkedin.com/in/avanimanoria",
        "github": "https://github.com/avanimanoria",
        "twitter": "",
        "writing": "",
    },
    "hero_meta": {
        "based_in": "India · Remote",
        "focus": "Full-stack · ML · AI",
        "experience": "Final Year · Engineering",
        "status": "Open to opportunities",
    },
    "stats_shipped": "3",
    "stats_regions": "1",
    "stats_automations": "∞",
}


def _default_projects():
    now = datetime.now(timezone.utc).isoformat()
    return [
        {
            "id": str(uuid.uuid4()),
            "kind": "Full-stack",
            "year": "2025",
            "title": "Activity Points Management System",
            "blurb": "A complete web platform to track, verify and credit student activity points across a university. Faculty-approval workflow, student submissions, admin dashboards, exportable transcripts — designed so nobody ever has to email a spreadsheet again.",
            "stack": ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
            "image_url": "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "github_url": "",
            "live_url": "",
            "order": 0,
            "created_at": now,
        },
        {
            "id": str(uuid.uuid4()),
            "kind": "Machine Learning",
            "year": "2025",
            "title": "Customer Churn Prediction Engine",
            "blurb": "An end-to-end ML pipeline that predicts customer churn on a telecom-style dataset — from EDA and feature engineering to model comparison (Logistic, Random Forest, XGBoost), calibration, threshold tuning, and a lightweight inference API.",
            "stack": ["Python", "Pandas", "scikit-learn", "XGBoost", "FastAPI"],
            "image_url": "https://images.unsplash.com/photo-1709625862266-014ef072fd93?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGx1eHVyeSUyMGRhcmslMjBnZW9tZXRyeSUyMDNkfGVufDB8fHx8MTc4MjkzNDM0N3ww&ixlib=rb-4.1.0&q=85",
            "github_url": "",
            "live_url": "",
            "order": 1,
            "created_at": now,
        },
        {
            "id": str(uuid.uuid4()),
            "kind": "AI · Original Concept",
            "year": "2026",
            "title": "Vellum — a cognitive architecture that learns like humans forget",
            "blurb": "A novel LLM cognitive architecture that treats forgetting as a first-class feature. Vellum introduces sleep-like consolidation cycles, decayed episodic memory, and a metacognitive layer that revises its own beliefs. Because most AIs remember everything and understand nothing — and that gap is what I want to close.",
            "stack": ["Python", "PyTorch", "Transformers", "Vector DBs", "Cognitive Systems"],
            "image_url": "https://images.unsplash.com/photo-1517241034903-9a4c3ab12f00?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGx1eHVyeSUyMGRhcmslMjBnZW9tZXRyeSUyMDNkfGVufDB8fHx8MTc4MjkzNDM0N3ww&ixlib=rb-4.1.0&q=85",
            "github_url": "",
            "live_url": "",
            "order": 2,
            "created_at": now,
        },
    ]


def _default_education():
    return [
        {
            "id": str(uuid.uuid4()),
            "period": "2022 — 2026",
            "degree": "B.Tech · Engineering",
            "institution": "Final Year Undergraduate · India",
            "notes": [
                "Coursework in data structures, systems, ML, and web technologies.",
                "Independent projects spanning full-stack, applied ML, and original AI concepts.",
            ],
            "order": 0,
        },
    ]


# ---------- Startup ----------
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    # Seed admin
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Avani Manoria",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user: %s", ADMIN_EMAIL)
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        # keep admin password in sync with .env
        await db.users.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info("Refreshed admin password from env.")
    # Seed content
    if not await db.settings.find_one({"id": "singleton"}):
        await db.settings.insert_one(DEFAULT_SETTINGS.copy())
    if await db.projects.count_documents({}) == 0:
        await db.projects.insert_many(_default_projects())
    if await db.education.count_documents({}) == 0:
        await db.education.insert_many(_default_education())


# ---------- Auth routes ----------
@api_router.post("/auth/login", response_model=TokenOut)
async def login(payload: LoginIn):
    email = payload.email.lower().strip()
    key = f"login:{email}"
    attempts = await db.login_attempts.find_one({"identifier": key})
    if attempts and attempts.get("locked_until"):
        try:
            locked_until = datetime.fromisoformat(attempts["locked_until"])
            if locked_until > datetime.now(timezone.utc):
                raise HTTPException(status_code=423, detail="Too many attempts. Try again later.")
        except HTTPException:
            raise
        except Exception:
            pass
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        count = (attempts.get("count", 0) if attempts else 0) + 1
        update = {"count": count, "last": datetime.now(timezone.utc).isoformat()}
        if count >= 5:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
            update["count"] = 0
        await db.login_attempts.update_one({"identifier": key}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid credentials")
    await db.login_attempts.delete_one({"identifier": key})
    token = create_access_token(user["id"], user["email"])
    return TokenOut(
        access_token=token,
        user={"id": user["id"], "email": user["email"], "name": user.get("name")},
    )


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return {"id": admin["id"], "email": admin["email"], "name": admin.get("name")}


# ---------- Public content ----------
@api_router.get("/profile/settings")
async def get_settings():
    s = await db.settings.find_one({"id": "singleton"}, {"_id": 0})
    if not s:
        return DEFAULT_SETTINGS
    return s


@api_router.patch("/profile/settings")
async def update_settings(body: SettingsUpdate, admin=Depends(get_current_admin)):
    patch = {}
    for k, v in body.model_dump(exclude_unset=True).items():
        if v is not None:
            patch[k] = v
    if patch:
        await db.settings.update_one({"id": "singleton"}, {"$set": patch}, upsert=True)
    s = await db.settings.find_one({"id": "singleton"}, {"_id": 0})
    return s


@api_router.get("/projects", response_model=List[Project])
async def list_projects():
    docs = await db.projects.find({}, {"_id": 0}).sort([("order", 1)]).to_list(200)
    return docs


@api_router.post("/projects", response_model=Project)
async def create_project(body: ProjectIn, admin=Depends(get_current_admin)):
    obj = Project(**body.model_dump())
    await db.projects.insert_one(obj.model_dump())
    return obj


@api_router.patch("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, body: ProjectIn, admin=Depends(get_current_admin)):
    await db.projects.update_one({"id": project_id}, {"$set": body.model_dump()})
    doc = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return doc


@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, admin=Depends(get_current_admin)):
    res = await db.projects.delete_one({"id": project_id})
    return {"deleted": res.deleted_count}


@api_router.get("/education", response_model=List[Education])
async def list_education():
    docs = await db.education.find({}, {"_id": 0}).sort([("order", 1)]).to_list(100)
    return docs


@api_router.post("/education", response_model=Education)
async def create_education(body: EducationIn, admin=Depends(get_current_admin)):
    obj = Education(**body.model_dump())
    await db.education.insert_one(obj.model_dump())
    return obj


@api_router.patch("/education/{eid}", response_model=Education)
async def update_education(eid: str, body: EducationIn, admin=Depends(get_current_admin)):
    await db.education.update_one({"id": eid}, {"$set": body.model_dump()})
    doc = await db.education.find_one({"id": eid}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return doc


@api_router.delete("/education/{eid}")
async def delete_education(eid: str, admin=Depends(get_current_admin)):
    res = await db.education.delete_one({"id": eid})
    return {"deleted": res.deleted_count}


# ---------- Contact ----------
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    obj = ContactMessage(**payload.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['email'] = str(doc['email'])
    await db.contact_messages.insert_one(doc)
    return obj


@api_router.get("/admin/messages", response_model=List[ContactMessage])
async def list_admin_messages(admin=Depends(get_current_admin)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for m in messages:
        if isinstance(m.get('created_at'), str):
            try:
                m['created_at'] = datetime.fromisoformat(m['created_at'])
            except Exception:
                m['created_at'] = datetime.now(timezone.utc)
    return messages


@api_router.delete("/admin/messages/{mid}")
async def delete_message(mid: str, admin=Depends(get_current_admin)):
    res = await db.contact_messages.delete_one({"id": mid})
    return {"deleted": res.deleted_count}


@api_router.get("/")
async def root():
    return {"message": "Avani Manoria Portfolio API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
