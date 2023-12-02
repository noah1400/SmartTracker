
from app.auth.auth import auth
from app.graphql.mutations import is_authorized_for_action
from app.db.models import TimeEntry
from app.auth.exceptions import Unauthorized
from app.graphql.exceptions import NotFound
from app.db import db

unauthorized = Unauthorized('Unauthorized')
time_entry_not_found = NotFound('Time entry not found')

### Helpers ###

def update_time_entry_properties(time_entry, description, start_time, end_time, user_id, project_id):
    """Updates the time entry properties."""
    time_entry.description = description if description else time_entry.description
    time_entry.start_time = start_time if start_time else time_entry.start_time
    time_entry.end_time = end_time if end_time else time_entry.end_time
    time_entry.user_id = user_id if user_id else time_entry.user_id
    time_entry.project_id = project_id if project_id else time_entry.project_id
    db.session.commit()
    return time_entry


### Resolvers ###
    
def resolve_create_time_entry(obj, info, description, start_time, end_time, user_id, project_id):
    if auth.user.has_permission('create:time_entries'):
        time_entry = TimeEntry(description=description, start_time=start_time, end_time=end_time, user_id=user_id, project_id=project_id)
        db.session.add(time_entry)
        db.session.commit()
        return time_entry.to_dict()
    else:
        raise unauthorized
    
def resolve_update_time_entry(obj, info, id, description, start_time, end_time, user_id, project_id):
    time_entry = TimeEntry.query.get(id)
    if not time_entry:
        raise time_entry_not_found

    is_own_entry = time_entry.user_id == auth.user.id
    if not is_authorized_for_action('time_entry', 'update', time_entry.user_id if is_own_entry else None):
        raise unauthorized

    update_time_entry_properties(time_entry, description, start_time, end_time, user_id, project_id)
    return [time_entry.id]

def resolve_delete_time_entry(obj, info, id):
    time_entry = TimeEntry.query.get(id)
    if not time_entry:
        raise time_entry_not_found
    
    is_own_entry = time_entry.user_id == auth.user.id
    if not is_authorized_for_action('time_entry', 'delete', time_entry.user_id if is_own_entry else None):
        raise unauthorized

    db.session.delete(time_entry)
    db.session.commit()
    return 1