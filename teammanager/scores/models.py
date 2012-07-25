from django.db import models

from teammanager.core.models import Person
from teammanager.events.models import Squad, EditionDivision

# rename the whole app to Games

class PhaseType(models.Model):
    """
    Group
    Elimination
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Phase(models.Model):
    """
    Group phase
    Elimination phase
    """
    name = models.CharField(max_length=200, blank=True, null=True)
    phase_type = models.ForeignKey(PhaseType)
    parent = models.ForeignKey("Phase", blank=True, null=True)
    edition_division = models.ForeignKey(EditionDivision, related_name="phases")

    def __unicode__(self):
        return 'Phase: %s of %s' % (self.name, self.edition_division)

class Group(models.Model):
    name = models.CharField(max_length=200)
    parent = models.ForeignKey("Group", blank=True, null=True)
    phase = models.ForeignKey(Phase, related_name="groups")
    squads = models.ManyToManyField(Squad)

    def __unicode__(self):
        return 'Group: %s of %s' % (self.name, self.phase)

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
    group = models.ForeignKey(Group, related_name='games')
    squad1 = models.ForeignKey(Squad, related_name='+')
    squad2 = models.ForeignKey(Squad, related_name='+')
    start = models.DateTimeField()
    length = models.PositiveIntegerField()
    points1 = models.PositiveIntegerField()
    points2 = models.PositiveIntegerField()
    state = models.ForeignKey(GameState)

    def __unicode__(self):
        return 'Game %s vs %s at %s' % (self.squad1.team,
                                        self.squad2.team,
                                        self.group)

class GameMomentType(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class GameMoment(models.Model):
    game = models.ForeignKey(Game, related_name='moments')
    moment_type = models.ForeignKey(GameMomentType)
    player1 = models.ForeignKey(Person, blank=True, null=True, related_name='+')
    player2 = models.ForeignKey(Person, blank=True, null=True, related_name='+')
    team = models.ForeignKey(Squad, blank=True, null=True, related_name='+')
    time = models.PositiveIntegerField()
    desc = models.CharField(max_length=200, blank=True, null=True)

