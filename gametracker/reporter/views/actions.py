from django.http import HttpResponse

from reporter.forms import AddActionForm

def addaction(request):
    f = AddActionForm(request.REQUEST)
    new_action = f.save(commit=False)
    new_action.game_id = 1
    new_action.time = 0
    f.save()

    return HttpResponse('OK')

