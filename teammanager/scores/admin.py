from django.contrib import admin

from teammanager.scores.models import Game, GameState, GameMomentType, GameMoment

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
