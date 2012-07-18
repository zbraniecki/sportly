from playerpicker.models import Person, \
                                View, \
                                ViewValue, \
                                Event, \
                                Roster

from django.contrib import admin

class RosterAdmin(admin.ModelAdmin):
    filter_horizontal = ["players"]

admin.site.register(Person)
admin.site.register(View)
admin.site.register(ViewValue)
admin.site.register(Event)
admin.site.register(Roster, RosterAdmin)
