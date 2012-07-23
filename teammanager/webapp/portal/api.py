from django.http import HttpResponse
from django.contrib import auth
import json
import datetime

from django.db import models
from teammanager.core.models import Person
from teammanager.events.models import Edition, TeamSignUp, SignUpStatus, EventTeam

def authenticate(request):
    username = request.REQUEST.get('username', None)
    password = request.REQUEST.get('password', None)
    if not username or not password:
        return HttpResponse('Error: Missing argument')
    user = auth.authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            auth.login(request, user)
            return HttpResponse('OK')
        else:
            return HttpResponse('Error: Disabled Account')
    else:
        return HttpResponse('Error: Invalid Login')

def events(request):
    start = request.REQUEST.get('start', None)
    end = request.REQUEST.get('end', None)
    start = datetime.datetime.fromtimestamp(int(start))
    end = datetime.datetime.fromtimestamp(int(end))
    dthandler = lambda obj: obj.isoformat() if isinstance(obj, datetime.date) else None
    el = (Edition.objects.filter(start_date__gte=start)
                        .filter(models.Q(end_date__lte=end) | models.Q(end_date__isnull=True)))
    l = []
    for edition in el:
        occurance = {
          'title': edition.short_name(),
          'start': edition.start_date,
          'url': '/events/%s' % edition.id
        }
        if edition.end_date:
            occurance['end'] = edition.end_date;
        l.append(occurance)
    response = json.dumps(l, default=dthandler)
    return HttpResponse(response, mimetype="application/json")

def event_signup(request, eid, dec):
    person = Person.objects.get(name="Zbigniew")
    if dec == 'undecided':
        status = None
    else:
        status = SignUpStatus.objects.get(name=dec)
    try:
        ts = TeamSignUp.objects.get(event__id=eid, person=person)
        if status is None:
            ts.delete()
        else:
            ts.status = status
            ts.save()
    except TeamSignUp.DoesNotExist:
        if status is not None:
            et = EventTeam.objects.get(id=eid)
            ts = TeamSignUp(event=et,
                            person=person,
                            status=status)
            ts.save()
    return HttpResponse('OK')
