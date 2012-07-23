from teammanager.core.models import Team
from teammanager.events.models import Event, Edition, EventTeam
from django.shortcuts import render_to_response

def index(request):
    user = request.user
    team = Team.objects.get(name="4Hands")
    return render_to_response('portal/index.html', {'team': team,
                                                    'user': user})

def event(request, eid):
    event = Edition.objects.get(id=eid)
    team = Team.objects.get(name="4Hands")
    eteam = EventTeam.objects.get(event=event, team=team)
    user = request.user
    return render_to_response('portal/event.html', {'team': team,
                                                    'user': user,
                                                    'event': event,
                                                    'eteam': eteam})
