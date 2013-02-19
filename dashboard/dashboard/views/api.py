from django.http import HttpResponse
from tracker.models.events import EventDivision, EventDivisionSignUp, Roster
import json


def event(request, eid):
    ed = EventDivision.objects.get(pk=eid)
    ret = {}
    ret['name'] = ed.__str__()
    ret['teams'] = [];
    signups = EventDivisionSignUp.objects.filter(event_division=ed,
                                                 status__name="yes")
    for signup in signups:
        squad = signup.signee
        ret['teams'].append({'name': squad.team_name(), 'id': squad.pk, 'seed': signup.seed})
    return HttpResponse(json.dumps(ret))

def setseeding(request, eid, tid, pos):
    ed = EventDivision.objects.get(pk=eid)
    roster = Roster.objects.get(pk=tid)

    eds = ed.signups.get(object_id=roster.pk)
    eds.seed = pos
    eds.save()
    return HttpResponse('OK')

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
