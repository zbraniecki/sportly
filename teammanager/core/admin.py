from teammanager.core.models import Sport, Division, Team, Event, Person

from django.contrib import admin

class EventAdmin(admin.ModelAdmin):
    filter_horizontal = ["available_players"]

class TeamAdmin(admin.ModelAdmin):
    filter_horizontal = ["roster"]

admin.site.register(Sport)
admin.site.register(Division)
admin.site.register(Team, TeamAdmin)

admin.site.register(Event, EventAdmin)
admin.site.register(Person)
