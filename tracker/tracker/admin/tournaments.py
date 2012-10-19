from tracker.models.tournaments import LinkType, Link, StageType, Stage
from tracker.models.tournaments import Group, GroupRoster, FieldType

from django.contrib import admin

class StageAdmin(admin.ModelAdmin):
    list_filter = ('event_division__event__name', 'event_division__division__name', 'stage_type')
    list_display = ('name', 'event_division', 'stage_type', 'pos')

admin.site.register(LinkType)
admin.site.register(Link)
admin.site.register(StageType)
admin.site.register(Stage, StageAdmin)
admin.site.register(Group)
admin.site.register(GroupRoster)
admin.site.register(FieldType)

