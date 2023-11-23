from flask import Blueprint
from ariadne import load_schema_from_path, make_executable_schema,snake_case_fallback_resolvers, ObjectType
import app.graphql.queries as queries
import app.graphql.mutations as mutations

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

mutation = ObjectType('Mutation')
mutation.set_field('createUser', mutations.resolve_create_user)
mutation.set_field('updateUser', mutations.resolve_update_user)
mutation.set_field('deleteUser', mutations.resolve_delete_user)

mutation.set_field('createProject', mutations.resolve_create_project)
mutation.set_field('updateProject', mutations.resolve_update_project)
mutation.set_field('deleteProject', mutations.resolve_delete_project)

mutation.set_field('createTimeEntry', mutations.resolve_create_time_entry)
mutation.set_field('updateTimeEntry', mutations.resolve_update_time_entry)
mutation.set_field('deleteTimeEntry', mutations.resolve_delete_time_entry)

type_defs = load_schema_from_path('smarttracker/app/graphql/schema.graphql')
schema = make_executable_schema(type_defs, query, mutation, user_type, project_type, timeEntry_type)

from app.graphql import routes

