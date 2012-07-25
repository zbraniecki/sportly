from teammanager.events.models import Event, EventType, Edition, Squad
from teammanager.scores.models import Game
from django.shortcuts import render_to_response

import datetime

def index(request):
    event_type = EventType.objects.get(name="Season")
    cur_season = Edition.objects.get(event__event_type=event_type,
                                     start_date__lte=datetime.date.today(),
                                     end_date__gte=datetime.date.today())
    types = EventType.objects.filter(name__in=('Tournament',))
    tournaments = Edition.objects.filter(parent=cur_season,
                                         event__event_type__in=types)
    types = EventType.objects.filter(name__in=('League',))
    leagues = Edition.objects.filter(parent=cur_season,
                                     event__event_type__in=types)
    types = EventType.objects.filter(name__in=('Sparring',))
    sparrings = Edition.objects.filter(parent=cur_season,
                                       event__event_type__in=types)
    types = EventType.objects.filter(name__in=('Training',))
    trainings = Edition.objects.filter(parent=cur_season,
                                       event__event_type__in=types)
    return render_to_response('dashboard/index.html', {'tournaments': tournaments,
                                                       'leagues': leagues,
                                                       'sparrings': sparrings,
                                                       'trainings': trainings})

def edition(request, eid):
    edition = Edition.objects.get(id=eid)
    return render_to_response('dashboard/sparring.html', {'edition': edition,})

def game(request, gid):
    game = Game.objects.get(id=gid)
    return render_to_response('dashboard/game.html', {'game': game,})
