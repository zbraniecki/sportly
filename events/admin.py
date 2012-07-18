from events.models import Event, \
                          Tournament, \
                          Training, \
                          Roster

from django.contrib import admin

class RosterAdmin(admin.ModelAdmin):
    filter_horizontal = ["players"]


class EventAdmin(admin.ModelAdmin):
    filter_horizontal = ["available_players"]

admin.site.register(Event, EventAdmin)
admin.site.register(Training, EventAdmin)
admin.site.register(Tournament, EventAdmin)
admin.site.register(Roster, RosterAdmin)


