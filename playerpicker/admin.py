from playerpicker.models import Player, \
                                Test, \
                                Skill, \
                                PlayerSkill, \
                                TestResult, \
                                Line, \
                                Role, \
                                Play, \
                                TeamActivity
from django.contrib import admin

admin.site.register(Player)
admin.site.register(Line)
admin.site.register(Role)
admin.site.register(Play)
admin.site.register(Skill)
admin.site.register(PlayerSkill)
admin.site.register(Test)
admin.site.register(TestResult)
admin.site.register(TeamActivity)

