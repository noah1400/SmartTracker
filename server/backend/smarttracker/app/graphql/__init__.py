from flask import Blueprint
from ariadne import load_schema_from_path, make_executable_schema,snake_case_fallback_resolvers, ObjectType
import app.graphql.queries.user_queries as user_queries
import app.graphql.queries.project_queries as project_queries
import app.graphql.queries.time_entry_queries as time_entry_queries
import app.graphql.mutations.user_mutations as user_mutations
import app.graphql.mutations.project_mutations as project_mutations
import app.graphql.mutations.time_entry_mutations as time_entry_mutations

bp_graphql = Blueprint('graphql', __name__, url_prefix='/graphql')

query = ObjectType('Query')
query.set_field('projects', project_queries.resolve_projects)
query.set_field('project', project_queries.resolve_project)
query.set_field('timeEntries', time_entry_queries.resolve_time_entries)
query.set_field('timeEntry', time_entry_queries.resolve_time_entry)
query.set_field('users', user_queries.resolve_users)
query.set_field('user', user_queries.resolve_user)

user_type = ObjectType('User')
user_type.set_field('timeEntries', queries.resolve_time_entries_for_user)

project_type = ObjectType('Project')
project_type.set_field('timeEntries', queries.resolve_time_entries_for_project)

timeEntry_type = ObjectType('TimeEntry')
timeEntry_type.set_field('user', queries.resolve_user_for_time_entry)
timeEntry_type.set_field('project', queries.resolve_project_for_time_entry)

mutation = ObjectType('Mutation')
mutation.set_field('createUser', user_mutations.resolve_create_user)
mutation.set_field('updateUser', user_mutations.resolve_update_user)
mutation.set_field('deleteUser', user_mutations.resolve_delete_user)

mutation.set_field('createProject', project_mutations.resolve_create_project)
mutation.set_field('updateProject', project_mutations.resolve_update_project)
mutation.set_field('deleteProject', project_mutations.resolve_delete_project)

mutation.set_field('createTimeEntry', time_entry_mutations.resolve_create_time_entry)
mutation.set_field('updateTimeEntry', time_entry_mutations.resolve_update_time_entry)
mutation.set_field('deleteTimeEntry', time_entry_mutations.resolve_delete_time_entry)

type_defs = load_schema_from_path('smarttracker/app/graphql/schema.graphql')
schema = make_executable_schema(type_defs, query, mutation, user_type, project_type, timeEntry_type)

from app.graphql import routes

