from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=200)
    parent = models.ForeignKey("Team", blank=True, null=True)

    def __unicode__(self):
        if self.parent:
            return "%s / %s" % (self.parent.__unicode__(), self.name)
        return self.name

