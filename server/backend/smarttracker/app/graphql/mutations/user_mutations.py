from app.auth.auth import auth
from app.auth.exceptions import Unauthorized
from app.db.models import User
from app.db import db
from app.graphql.mutations import is_authorized_for_action
from app.graphql.exceptions import NotFound

user_not_found = NotFound('User not found')
unauthorized = Unauthorized('Unauthorized')

### Helpers ###

def update_user_properties(user, username, email, service, role):
    """Updates the user properties."""
    user.username = username if username else user.username
    user.email = email if email else user.email
    user.service = service if service else user.service
    user.role = role if role else user.role
    db.session.commit()
    return user

### Resolvers ###

def resolve_create_user(obj, info, username, email, password, service, role = 'user'):
    if auth.user.has_permission('create:users'):
        user = User.create_with_role(username=username, email=email, password=password, service=service, role=role)
        return user.to_dict()
    else:
        raise unauthorized
    
def resolve_update_user(obj, info, id, username, email, service, role):
    user = User.query.get(id)
    if not user:
        raise user_not_found
    if not is_authorized_for_action('user', 'update', user.id):
        raise unauthorized
    user = update_user_properties(user, username, email, service, role)
    return [user.id]

def resolve_delete_user(obj, info, id):
    user = User.query.get(id)
    if not user:
        raise user_not_found
    if not is_authorized_for_action('user', 'delete', user.id):
        raise unauthorized
    db.session.delete(user)
    db.session.commit()
    return 1