from django.http import HttpResponse
from django.contrib import auth

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
