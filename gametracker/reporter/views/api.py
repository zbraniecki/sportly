from django.http import HttpResponse

import json
import time
from tracker.models.games import Game
from tracker.models.events import Roster

def get_game(request):
    game = Game.objects.get(pk=request.REQUEST.get('gid'))

    data = {
        'team1': {
            'name': 'BAB',
        },
        'team2': {
            'name': 'OSC'
        },
    }
    return HttpResponse(json.dumps(data), content_type="application/json")

def get_teams(request):
    teams = []

    rol = Roster.objects.all()

    for ro in rol:
        team = {'name': ro.name,
              'id': ro.pk}
        teams.append(team)

    return HttpResponse(json.dumps(teams), content_type="application/json")


def get_games(request):
    games = [];

    gol = Game.objects.all();

    for go in gol:
        settings = go.gamesettings_set.all()
        game = {
            'id': go.pk,
            'team1': {
                'id': go.roster1.id,
                'goals': 0,
                'timeouts': [],
            },
            'team2': {
                'id': go.roster2.id,
                'goals': 0,
                'timeouts': [],
            },
            'settings': {
                'starts': int(time.mktime(go.start.timetuple())*1000)
            },
        }
        print(dir(go.start))

        for s in settings:
            chunks = s.key.split('.')
            val = game['settings']
            for chunk in chunks[:-1]:
                if chunk not in val:
                    val[chunk] = {}
                val = val[chunk]
            val[chunks[-1]] = s.value
        games.append(game);

    return HttpResponse(json.dumps(games), content_type="application/json")
