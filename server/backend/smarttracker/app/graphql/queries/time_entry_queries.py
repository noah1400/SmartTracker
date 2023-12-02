from app.graphql.utils.auhorizations import is_authorized_for_action
from app.db.models import TimeEntry
from app.auth.auth import auth
from app.graphql.exceptions import NotFound
from app.auth.exceptions import Unauthorized

unauthorized = Unauthorized('Unauthorized')
time_entry_not_found = NotFound('Time entry not found')

def resolve_time_entries(obj, info):
    if is_authorized_for_action('time_entry', 'read'):
        time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.all()]
        return time_entries
    elif is_authorized_for_action('time_entry', 'read', auth.user.id):
        time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(user_id=auth.user.id).all()]
        return time_entries
    else:
        raise unauthorized

def resolve_time_entry(obj, info, id):
    time_entry = TimeEntry.query.get(id)
    if not time_entry:
        raise time_entry_not_found
    
    is_own_entry = time_entry.user_id == auth.user.id
    if not is_authorized_for_action('time_entry', 'read', time_entry.user_id if is_own_entry else None):
        raise unauthorized
    
    return time_entry.to_dict()
    
def resolve_time_entries_for_user(user: dict, info):
    if is_authorized_for_action('time_entry', 'read', user['id']):
        time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(user_id=user['id']).all()]
        return time_entries
    else:
        raise unauthorized
    
def resolve_time_entries_for_project(project: dict, info):
    time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(project_id=project['id']).all()]
    if is_authorized_for_action('time_entry', 'read'):
        return time_entries
    
    filtered_time_entries = [ te.to_dict() for te in TimeEntry.query.filter_by(project_id=project['id']).all() if is_authorized_for_action('time_entry', 'read', te.user_id) ]
    return filtered_time_entries