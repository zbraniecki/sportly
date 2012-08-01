from django.http import HttpResponse
from teammanager.views.utils import get_view_dependency_tree
import json

def view_graph(request, vid):
    l = get_view_dependency_tree(vid)
    response = json.dumps(l)
    return HttpResponse(response, mimetype="application/json")

