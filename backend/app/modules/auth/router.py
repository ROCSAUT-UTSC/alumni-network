from fastapi import Depends
from app.modules.systems.deps import get_db, get_current_user, require_admin
