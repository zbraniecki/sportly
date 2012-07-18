from events.models import Event, \
                          Tournament, \
                          Training

from django.contrib import admin

admin.site.register(Event)
admin.site.register(Training)
admin.site.register(Tournament)


