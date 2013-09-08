from django.shortcuts import render

from tracker.models.games import Game

def index(request):
    gid = request.REQUEST.get('gid')
    game = Game.objects.get(pk=gid)
    logs = game.moments.all()
    context = {
        'team_home': {
            'name': game.roster1.name,
            'score': game.points1
        }, 
        'team_away': {
            'name': game.roster2.name,
            'score': game.points2
        },
        'time': {
          'start': game.start
        },
        'logs': logs,
    }
    return render(request, 'reporter/score.html', context)
