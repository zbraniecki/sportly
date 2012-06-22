from django.shortcuts import render_to_response
from playerpicker.models import Player, TeamActivity

def skills(request):
    players = Player.objects.all()
    return render_to_response('playerpicker/skills.html', {'players': players})

def teamactivity(request):
    talist = TeamActivity.objects.all()
    return render_to_response('playerpicker/teamactivity.html', {'talist': talist})

