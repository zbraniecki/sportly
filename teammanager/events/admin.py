from teammanager.events.models import GameType, Visibility, EditionDivisionInvitation
from teammanager.events.models import SquadInvitation, EventType, Event, SquadPersonRole
from teammanager.events.models import Edition, SelectionType, Squad, EditionDivision
from teammanager.events.models import SignUpStatus, TeamSignUp, EditionSignUp, TeamRole
from teammanager.events.models import AcceptedStatus


from django.contrib import admin
from django.contrib.contenttypes import generic

class SquadPersonRoleInline(admin.TabularInline):
    model = SquadPersonRole


class SquadInvitationInline(admin.TabularInline):
    model = SquadInvitation

class SquadAdmin(admin.ModelAdmin):
    inlines = (SquadPersonRoleInline, SquadInvitationInline)


class EditionDivisionInvitationInline(generic.GenericTabularInline):
    model = EditionDivisionInvitation
    fk_name = "edition_division"

class EditionDivisionInline(admin.TabularInline):
    model = EditionDivision

class EditionAdmin(admin.ModelAdmin):
    list_filter = ('event__event_type', 'event__game_type', 'start_date')
    #filter_horizontal = ["players"]
    date_hierarchy = 'start_date'
    inlines = [
        EditionDivisionInline,
    ]

class EventAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'event_type', 'game_type')
    list_filter = ('event_type', 'game_type')


admin.site.register(GameType)
admin.site.register(Visibility)
admin.site.register(EditionDivisionInvitation)
admin.site.register(SquadInvitation)
admin.site.register(EventType)
admin.site.register(Event, EventAdmin)
admin.site.register(SquadPersonRole)
admin.site.register(Edition, EditionAdmin)
admin.site.register(SelectionType)
admin.site.register(Squad, SquadAdmin)
admin.site.register(SignUpStatus)
admin.site.register(AcceptedStatus)
admin.site.register(TeamSignUp)
admin.site.register(EditionSignUp)
admin.site.register(TeamRole)
