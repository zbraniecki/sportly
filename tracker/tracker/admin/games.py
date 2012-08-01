from django.contrib import admin

from tracker.models.games import Game, GameState, GameMomentType, GameMoment
from tracker.models.games import PhaseType, Phase, Group, Field, Qualification

class GameMomentInline(admin.TabularInline):
    model = GameMoment

class GameAdmin(admin.ModelAdmin):
    inlines = [
        GameMomentInline
    ]

admin.site.register(Game, GameAdmin)
admin.site.register(GameState)
admin.site.register(GameMomentType)
admin.site.register(GameMoment)
admin.site.register(PhaseType)
admin.site.register(Phase)
admin.site.register(Group)
admin.site.register(Field)
admin.site.register(Qualification)
