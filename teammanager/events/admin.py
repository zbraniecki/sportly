from teammanager.events.models import Tournament, \
                                      Training

from teammanager.core.admin import EventAdmin

from django.contrib import admin

class TournamentAdmin(EventAdmin):
    filter_horizontal = ["available_players", "roster"]

admin.site.register(Training, EventAdmin)
admin.site.register(Tournament, TournamentAdmin)
