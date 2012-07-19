from django.shortcuts import render_to_response
from teammanager.views.models import View, ViewValue, Person

def views(request):
    views = View.objects.all()
    return render_to_response('views/views.html', {'views': views})

def view(request, vid):
    v1 = View.objects.get(pk=vid)
    if v1.formula:
        v1.compute_values()
    return render_to_response('views/plainview.html', {'view': v1})

def skills(request):
    players = Player.objects.all()
    return render_to_response('playerpicker/skills.html', {'players': players})

def teamactivity(request):
    talist = TeamActivity.objects.all()
    return render_to_response('playerpicker/teamactivity.html', {'talist': talist})

