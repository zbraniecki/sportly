from tracker.models.events import EventType, Event, EventDivision
from tracker.models import Game, Stage, Group
from django.shortcuts import render_to_response

from dashboard import utils

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
    #if edition.event.event_type.name == 'Sparring':
    #    return render_to_response('dashboard/sparring.html', {'edition': edition,})
    #if edition.event.event_type.name == 'Tournament':
    #    return render_to_response('dashboard/tournament.html', {'edition': edition,})
    return render_to_response('dashboard/edition.html', {'edition': edition,})

def division(request, edid):
    ed = EditionDivision.objects.get(id=edid)
    return render_to_response('dashboard/division.html', {'ed': ed,})

def phase(request, pid):
    phase = Phase.objects.get(id=pid)
    return render_to_response('dashboard/phase.html', {'phase': phase,})

def group(request, gid):
    group = Group.objects.get(id=gid)
    table = utils.generate_group_table(group)
    return render_to_response('dashboard/group2.html', {'group': group,
                                                       'table': table})

def game(request, gid):
    game = Game.objects.get(id=gid)
    return render_to_response('dashboard/game.html', {'game': game,})

def planner(request):
    return render_to_response('dashboard/planner.html')
