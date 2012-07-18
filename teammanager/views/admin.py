from playerpicker.models import View, \
                                ViewValue

from django.contrib import admin

class ViewValueInline(admin.TabularInline):
    model = ViewValue

class ViewAdmin(admin.ModelAdmin):
    inlines = [
        ViewValueInline,
    ]

admin.site.register(View, ViewAdmin)
admin.site.register(ViewValue)

