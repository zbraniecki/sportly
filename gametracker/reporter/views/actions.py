from django.http import HttpResponse

from reporter.forms import AddActionForm
from tracker.models.games import GameMoment

def remove_moment(request):
    f = GameMoment.objects.get(pk=request.REQUEST.get('moment'))
    f.delete()
    return HttpResponse('OK')

def add_moment(request):
    f = AddActionForm(request.REQUEST)
    new_action = f.save(commit=False)
    new_action.game_id = 1
    new_action.time = 0
    f.save()

    return HttpResponse('OK')

