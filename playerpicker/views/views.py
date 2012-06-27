from django.shortcuts import render_to_response
from playerpicker.models import View, ViewAvailability

def view(request):
    v1 = View.objects.all()[0]
    print(v1.current_values())
    return render_to_response('playerpicker/view.html', {'view': v1})

def skills(request):
    players = Player.objects.all()
    return render_to_response('playerpicker/skills.html', {'players': players})

def teamactivity(request):
    talist = TeamActivity.objects.all()
    return render_to_response('playerpicker/teamactivity.html', {'talist': talist})

