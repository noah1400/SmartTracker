from app.graphql import bp_graphql, schema, type_defs
from flask import request, jsonify
from ariadne import graphql_sync
from ariadne.explorer.playground import PLAYGROUND_HTML

@bp_graphql.route('/', methods=['GET'])
def graphql_playground():
    return PLAYGROUND_HTML, 200

@bp_graphql.route('/', methods=['POST'])
def graphql():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=True
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code