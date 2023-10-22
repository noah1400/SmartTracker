from flask import Blueprint
from ariadne import load_schema_from_path, make_executable_schema,snake_case_fallback_resolvers, ObjectType
import app.graphql.queries as queries

bp_graphql = Blueprint('graphql', __name__, url_prefix='/graphql')

query = ObjectType('Query')
query.set_field('projects', queries.resolve_projects)
query.set_field('project', queries.resolve_project)
query.set_field('timeEntries', queries.resolve_time_entries)
query.set_field('timeEntry', queries.resolve_time_entry)
query.set_field('users', queries.resolve_users)
query.set_field('user', queries.resolve_user)

user_type = ObjectType('User')
user_type.set_field('timeEntries', queries.resolve_time_entries_for_user)

project_type = ObjectType('Project')
project_type.set_field('timeEntries', queries.resolve_time_entries_for_project)

timeEntry_type = ObjectType('TimeEntry')
timeEntry_type.set_field('user', queries.resolve_user_for_time_entry)
timeEntry_type.set_field('project', queries.resolve_project_for_time_entry)

type_defs = load_schema_from_path('smarttracker/app/graphql/schema.graphql')
schema = make_executable_schema(type_defs, query, user_type, project_type, timeEntry_type)

from app.graphql import routes

