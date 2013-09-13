from django.contrib import admin

from tracker.models.tournaments import GroupRoster
from tracker.models.games import Game, GameState, GameSettings, GameMomentType, GameMoment

class GameMomentInline(admin.TabularInline):
    model = GameMoment

class GameSettingsInline(admin.TabularInline):
    model = GameSettings

class GameAdmin(admin.ModelAdmin):
    inlines = [
        GameSettingsInline,
        GameMomentInline,
    ]

class GroupRosterInline(admin.TabularInline):
    model = GroupRoster

class GroupAdmin(admin.ModelAdmin):
    inlines = [
        GroupRosterInline
    ]

admin.site.register(Game, GameAdmin)
admin.site.register(GameState)
admin.site.register(GameSettings)
admin.site.register(GameMomentType)
admin.site.register(GameMoment)
