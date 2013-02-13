from django.http import HttpResponse
from tracker.models.events import EventDivision
import json


def event(request, eid):
    ed = EventDivision.objects.get(pk=eid)
    ret = {}
    ret['name'] = ed.__str__()
    ret['teams'] = [];
    for squad in ed.squads():
        ret['teams'].append(squad.team_name())
    return HttpResponse(json.dumps(ret))

def bracket(request, gid):
    d = """
{
  "name": "Winner",
  "winners": [
    {
      "name": "9w",
      "winners": [
        {
          "name": "1w",
          "winners": [
            {"name": "A1"},
            {"name": "C2"}
          ]
        },
        {
          "name": "2w",
          "winners": [
            {"name": "B1"},
            {"name": "D2"}
          ]
        }
      ]
    },
    {
      "name": "10w",
      "winners": [
        {
          "name": "3w",
          "winners": [
            {"name": "B2"},
            {"name": "D1"}
          ]
         },
        {
          "name": "4w",
          "winners": [
            {"name": "A2"},
            {"name": "C1"}
          ]
        }
      ]
    }
  ]
}"""
    return HttpResponse(d)
