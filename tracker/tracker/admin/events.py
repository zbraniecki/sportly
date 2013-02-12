from tracker.models.events import EventFieldType, EventType, EventVisibility
from tracker.models.events import Series, Event, EventDivision
from tracker.models.events import SquadSelectionType, Roster
from tracker.models.events import EventDivisionInvitation, RosterInvitation
from tracker.models.events import SignUpStatus, AcceptedStatus, RosterSignUp
from tracker.models.events import EventDivisionSignUp, RosterPersonRole

from django.contrib import admin
from django.contrib.contenttypes import generic

class RosterPersonRoleInline(admin.TabularInline):
    model = RosterPersonRole


class RosterInvitationInline(admin.TabularInline):
    model = RosterInvitation

class RosterAdmin(admin.ModelAdmin):
    inlines = (RosterPersonRoleInline, RosterInvitationInline)


class EventDivisionInvitationInline(generic.GenericTabularInline):
    model = EventDivisionInvitation
    fk_name = "event_division"

class EventDivisionInline(admin.TabularInline):
    model = EventDivision

class EventDivisionSignUpInline(admin.TabularInline):
    model = EventDivisionSignUp

class EventDivisionAdmin(admin.ModelAdmin):
    inlines = [
        EventDivisionSignUpInline
    ]

class EventAdmin(admin.ModelAdmin):
    list_filter = ('event__event_type', 'event__field_type', 'start_date')
    #filter_horizontal = ["players"]
    list_display = ('name', 'start_date', 'end_date')
    date_hierarchy = 'start_date'
    inlines = [
        EventDivisionInline,
    ]

class SeriesAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'event_type', 'field_type')
    list_filter = ('event_type', 'field_type')

admin.site.register(EventFieldType)
admin.site.register(EventType)
admin.site.register(EventVisibility)
admin.site.register(Series, SeriesAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(EventDivision, EventDivisionAdmin)
admin.site.register(SquadSelectionType)
admin.site.register(Roster, RosterAdmin)
admin.site.register(EventDivisionInvitation)
admin.site.register(RosterInvitation)
admin.site.register(SignUpStatus)
admin.site.register(AcceptedStatus)
admin.site.register(RosterSignUp)
admin.site.register(EventDivisionSignUp)
admin.site.register(RosterPersonRole)
