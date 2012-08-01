from django.db import models

class TrackerModel(models.Model):
    class Meta:
        abstract = True
        app_label = 'tracker'

class Person(TrackerModel):
    name = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s %s' % (self.name, self.lastname)

class Sport(TrackerModel):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Division(TrackerModel):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

###
#  Club as a top level above the Team
###

class Team(TrackerModel):
    name = models.CharField(max_length=200)
    sport = models.ForeignKey(Sport)
    division = models.ForeignKey(Division, blank=True, null=True)
    parent = models.ForeignKey("Team", blank=True, null=True)

    def __unicode__(self):
        if self.parent:
            return "%s / %s" % (self.parent.__unicode__(), self.name)
        return self.name


