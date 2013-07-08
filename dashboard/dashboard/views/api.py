from django.http import HttpResponse
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from tracker.models.events import EventDivision, EventDivisionSignUp, Roster
from tracker.models.tournaments import Stage, Group, Link, LinkType
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
                                    'pos': group.pos})
        ret['stages'].append(stret)

    groups = Group.objects.filter(stage__event_division=ed).values_list('id', flat=True)
    group_type = ContentType.objects.db_manager('tracker').get_for_model(Group)
    roster_type = ContentType.objects.db_manager('tracker').get_for_model(Roster)
    links = Link.objects.filter(Q(object_id_from__in=groups, content_type_from=group_type) | \
                                Q(object_id_to__in=groups, content_type_to=group_type))
    ret['links'] = []
    for link in links:
        ret['links'].append({'from': {
                               'type': 'Roster' if link.content_type_from == roster_type else 'Group',
                               'id': link.object_id_from,
                               'pos': link.position_from
                             },
                             'to': {
                               'type': 'Group',
                               'id': link.object_id_to,
                               'pos': link.position_to
                             }})
    return HttpResponse(json.dumps(ret))

def setlink(request):
    edid = request.GET.get('edid')
    from_type = request.GET.get('from_type')
    from_id = request.GET.get('from_id')
    from_pos = request.GET.get('from_pos')
    to_type = request.GET.get('to_type')
    to_id = request.GET.get('to_id')
    to_pos = request.GET.get('to_pos')
    ed = EventDivision.objects.get(pk=edid)
    if from_type == 'roster':
      from_object = Roster.objects.get(pk=from_id)
      from_ctype = ContentType.objects.db_manager('tracker').get_for_model(Roster)
    else:
      from_object = Group.objects.get(pk=from_id)
      from_ctype = ContentType.objects.db_manager('tracker').get_for_model(Group)


    to_object = Group.objects.get(id=to_id)
    to_ctype = ContentType.objects.db_manager('tracker').get_for_model(Group)
    
    try:
        link = Link.objects.using('tracker').get(content_type_from=from_ctype,
                                                 object_id_from=from_object.id,
                                                 position_from=from_pos)
    except Link.DoesNotExist:
        link_type = LinkType.objects.get(name="qualifies")
        link = Link(content_type_from=from_ctype,
                    object_id_from=from_object.id,
                    position_from=from_pos,
                    link_type=link_type)
    link.object_id_to = to_object.id
    link.content_type_to = to_ctype
    link.position_to = to_pos
    link.save()
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
