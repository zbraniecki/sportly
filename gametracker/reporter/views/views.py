from django.shortcuts import render, render_to_response

def index(request):
    context = {
        'offline': False,
    }
    return render(request, 'reporter/index.html', context)

def appcache(request):
    return render_to_response('reporter/reporter.appcache', {},
        content_type="text/cache-manifest")
