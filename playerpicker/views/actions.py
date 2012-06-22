from django.http import HttpResponse
from playerpicker.models import TeamActivity

def teamactivity(request):
    pid = request.REQUEST.get('pid', None)
    value = request.REQUEST.get('value', None)
    if pid is None or value is None:
        return HttpResponse("ERROR: argument missing")
    ta = TeamActivity.objects.get(player__id=pid)
    ta.value = value
    ta.save()
    return HttpResponse("OK")


