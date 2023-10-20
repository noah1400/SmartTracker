from flask import Blueprint
from ariadne import load_schema_from_path, make_executable_schema,snake_case_fallback_resolvers, ObjectType
from app.graphql.queries import resolve_project, resolve_projects, resolve_time_entries, resolve_user, resolve_users, resolve_time_entry \
    , resolve_time_entries_for_user

bp_graphql = Blueprint('graphql', __name__, url_prefix='/graphql')

query = ObjectType('Query')
query.set_field('projects', resolve_projects)
query.set_field('project', resolve_project)
query.set_field('timeEntries', resolve_time_entries)
query.set_field('timeEntry', resolve_time_entry)
query.set_field('users', resolve_users)
query.set_field('user', resolve_user)

user_type = ObjectType('User')
user_type.set_field('timeEntries', resolve_time_entries_for_user)

type_defs = load_schema_from_path('smarttracker/app/graphql/schema.graphql')
schema = make_executable_schema(type_defs,query,user_type, snake_case_fallback_resolvers)

from app.graphql import routes

