from app.graphql.utils.auhorizations import is_authorized_for_action
from app.db.models.User import User
from app.auth.auth import auth
from app.auth.exceptions import Unauthorized

unauthorized = Unauthorized('Unauthorized')

### Any queries that return a user object or list of user objects ###

def resolve_users(obj, info):
    if is_authorized_for_action('user', 'read'):
        users = [user.to_dict() for user in User.query.all()]
        return users
    elif is_authorized_for_action('user', 'read', auth.user.id):
        user = User.query.get(auth.user.id)
        return [user.to_dict()]
    else:
        raise unauthorized  
    

def resolve_user(obj, info, id):
    if is_authorized_for_action('user', 'read', id):
        user = User.query.get(id)
        return user.to_dict()
    else:
        raise unauthorized
    
def resolve_user_for_time_entry(time_entry: dict, info):
    if is_authorized_for_action('user', 'read', time_entry['userId']):
        user = User.query.get(time_entry['userId'])
        return user.to_dict()
    else:
        raise unauthorized