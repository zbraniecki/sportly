from teammanager.core.models import Sport, Division, Team, Event, TeamRole, EventTeamPersonRole
from teammanager.core.models import Edition, EventType, Person, EventTeam, GameType

from django.contrib import admin

class EventTeamAdmin(admin.ModelAdmin):
    filter_horizontal = ["players"]


class EditionAdmin(admin.ModelAdmin):
    list_filter = ('event__event_type', 'event__game_type', 'startdate')
    filter_horizontal = ["players"]
    date_hierarchy = 'startdate'

class EventAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'event_type', 'game_type')
    list_filter = ('event_type', 'game_type')

admin.site.register(Sport)
admin.site.register(Division)
admin.site.register(Team)

admin.site.register(EventType)
admin.site.register(GameType)
admin.site.register(Event, EventAdmin)
admin.site.register(Edition, EditionAdmin)
admin.site.register(Person)
admin.site.register(TeamRole)
admin.site.register(EventTeam, EventTeamAdmin)
