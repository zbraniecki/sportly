from django.shortcuts import render_to_response
from playerpicker.models import View, ViewValue

def view(request):
    v1 = View.objects.all()[0]
    vwl = ViewValue.objects.filter(view=v1)
    return render_to_response('playerpicker/view.html', {'view': v1, 'vwl': vwl})

def skills(request):
    players = Player.objects.all()
    return render_to_response('playerpicker/skills.html', {'players': players})

def teamactivity(request):
    talist = TeamActivity.objects.all()
    return render_to_response('playerpicker/teamactivity.html', {'talist': talist})

