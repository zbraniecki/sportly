from django.shortcuts import render

def index(request):
    context = {
    }
    return render(request, 'reporter/index.html', context)
