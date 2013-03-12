from django.http import HttpResponse
from tracker.models.events import EventDivision, EventDivisionSignUp, Roster
from tracker.models.tournaments import Stage, Group, GroupRoster
import json


def event(request, eid):
    ed = EventDivision.objects.get(pk=eid)
    ret = {}
    ret['name'] = ed.__str__()
    ret['teams'] = [];
    ret['stages'] = [];
    signups = EventDivisionSignUp.objects.filter(event_division=ed,
                                                 status__name="yes")
    for signup in signups:
        squad = signup.signee
        ret['teams'].append({'name': squad.team_name(), 'id': squad.pk})

    stages = Stage.objects.filter(event_division=ed)
    for stage in stages:
        stret = {'id': stage.id,
                 'type': stage.stage_type.name,
                 'name': stage.name,
                 'pos': stage.pos,
                 'groups': []}
        groups = Group.objects.filter(stage=stage)
        for group in groups:
            stret['groups'].append({'id': group.id,
                                    'name': group.name,
                                    'pos': group.pos,
                                    'roster': []})
            roster = GroupRoster.objects.filter(group=group)
            for team in roster:
                stret['groups'][-1]['roster'].append({'id': team.squad.id,
                                                      'pos': team.pos})
        ret['stages'].append(stret)
    return HttpResponse(json.dumps(ret))

def setseeding(request, eid, tid, pos):
    ed = EventDivision.objects.get(pk=eid)
    roster = Roster.objects.get(pk=tid)

    stage = Stage.objects.get(event_division=ed, stage_type__name="seeding")
    group = Group.objects.get(stage=stage)

    #groster = GroupRoster.objects.get(group=group,
    #                                  squad=roster)

    groster, c = GroupRoster.objects.using('tracker').get_or_create(group=group,
                                                                    squad=roster)
    groster.pos = pos
    groster.save()

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
