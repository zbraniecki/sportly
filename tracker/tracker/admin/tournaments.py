from tracker.models.tournaments import LinkType, Link, StageType, Stage
from tracker.models.tournaments import Group, GroupRoster, FieldType, Field

from django.contrib import admin

class StageAdmin(admin.ModelAdmin):
    list_filter = ('event_division__event__name', 'event_division__division__name', 'stage_type', 'parent')
    list_display = ('name', 'event_division', 'stage_type', 'pos')

class GroupAdmin(admin.ModelAdmin):
    list_filter = ('stage__event_division__event__name', 'stage__event_division__division__name', 'stage')
    list_display = ('name', 'code_name', 'stage', 'pos')

admin.site.register(LinkType)
admin.site.register(Link)
admin.site.register(StageType)
admin.site.register(Stage, StageAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(GroupRoster)
admin.site.register(FieldType)
admin.site.register(Field)

