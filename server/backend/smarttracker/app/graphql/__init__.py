from flask import Blueprint
from ariadne import load_schema_from_path, make_executable_schema,snake_case_fallback_resolvers, ObjectType

bp_graphql = Blueprint('graphql', __name__, url_prefix='/graphql')

type_defs = load_schema_from_path('smarttracker/app/graphql/schema.graphql')
schema = make_executable_schema(type_defs, snake_case_fallback_resolvers)

from app.graphql import routes

