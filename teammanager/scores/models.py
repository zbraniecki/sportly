from django.db import models

from teammanager.core.models import Person
from teammanager.events.models import Squad, Edition

class GameState(models.Model):
    """
    not started
    running
    postponed
    frozen
    end time
    cup point
    ended
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Game(models.Model):
    edition = models.ForeignKey(Edition)
    team1 = models.ForeignKey(Squad, related_name='+')
    team2 = models.ForeignKey(Squad, related_name='+')
    start = models.DateTimeField()
    length = models.PositiveIntegerField()
    points1 = models.PositiveIntegerField()
    points2 = models.PositiveIntegerField()
    state = models.ForeignKey(GameState)

    def __unicode__(self):
        return 'Game %s vs %s at %s' % (self.team1.team,
                                        self.team2.team,
                                        self.edition.short_name())

class GameMomentType(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class GameMoment(models.Model):
    game = models.ForeignKey(Game)
    moment_type = models.ForeignKey(GameMomentType)
    player1 = models.ForeignKey(Person, blank=True, null=True, related_name='+')
    player2 = models.ForeignKey(Person, blank=True, null=True, related_name='+')
    team = models.ForeignKey(Squad, blank=True, null=True, related_name='+')
    time = models.TimeField()
    desc = models.CharField(max_length=200, blank=True, null=True)
