from django.shortcuts import render

from tracker.models.games import Game, GameMoment

def index(request):

    game = Game.objects.get(pk=1)
    logs = game.moments.all()
    print(logs)
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
