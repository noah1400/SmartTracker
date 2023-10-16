# auth methods
from flask import Blueprint

bp_auth = Blueprint('auth', __name__, url_prefix='/auth')

from app.auth import routes