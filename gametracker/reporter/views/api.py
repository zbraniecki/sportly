from django.http import HttpResponse

import json
from tracker.models.games import Game

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
