from teammanager.events.models import GameType, Visibility, EditionInvitation
from teammanager.events.models import EventTeamInvitation, EventType, Event, EventTeamPersonRole
from teammanager.events.models import Edition, SelectionType, EventTeam
from teammanager.events.models import SignUpStatus, TeamSignUp, EditionSignUp, TeamRole


from django.contrib import admin
from django.contrib.contenttypes import generic

class EventTeamPersonRoleInline(admin.TabularInline):
    model = EventTeamPersonRole


class EventTeamInvitationInline(admin.TabularInline):
    model = EventTeamInvitation

class EventTeamAdmin(admin.ModelAdmin):
    inlines = (EventTeamPersonRoleInline, EventTeamInvitationInline)


class EditionInvitationInline(generic.GenericTabularInline):
    model = EditionInvitation
    fk_name = "edition"

class EditionAdmin(admin.ModelAdmin):
    list_filter = ('event__event_type', 'event__game_type', 'start_date')
    #filter_horizontal = ["players"]
    date_hierarchy = 'start_date'
    inlines = [
      EditionInvitationInline,
    ]

class EventAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'event_type', 'game_type')
    list_filter = ('event_type', 'game_type')


admin.site.register(GameType)
admin.site.register(Visibility)
admin.site.register(EditionInvitation)
admin.site.register(EventTeamInvitation)
admin.site.register(EventType)
admin.site.register(Event, EventAdmin)
admin.site.register(EventTeamPersonRole)
admin.site.register(Edition, EditionAdmin)
admin.site.register(SelectionType)
admin.site.register(EventTeam, EventTeamAdmin)
admin.site.register(SignUpStatus)
admin.site.register(TeamSignUp)
admin.site.register(EditionSignUp)
admin.site.register(TeamRole)
