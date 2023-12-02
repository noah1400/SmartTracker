from app.graphql.utils.auhorizations import is_authorized_for_action
from app.db.models.Project import Project
from app.auth.exceptions import Unauthorized

unauthorized = Unauthorized('Unauthorized')

### Any queries that return a project object or list of project objects ###

def resolve_projects(obj, info):
    if is_authorized_for_action('project', 'read'):
        projects = [prj.to_dict() for prj in Project.query.all()]
        return projects
    else:
        raise unauthorized

def resolve_project(obj, info, id):
    if is_authorized_for_action('project', 'read'):
        project = Project.query.get(id)
        return project.to_dict()
    else:
        raise unauthorized
    
def resolve_project_for_time_entry(time_entry: dict, info):
    if not is_authorized_for_action('project', 'read'):
        raise unauthorized
    
    project = Project.query.get(time_entry['projectId'])
    return project.to_dict()