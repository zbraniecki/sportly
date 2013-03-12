from django.db import models
from django.contrib.contenttypes.models import ContentType
from tracker.models.core import TrackerModel, Person
from tracker.models.events import Roster
from tracker.models.tournaments import Group, Link, Field

class GameState(TrackerModel):
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

    def __str__(self):
        return self.name

class Game(TrackerModel):
    code_name = models.CharField(max_length=200, blank=True, null=True)
    desc = models.CharField(max_length=200, blank=True, null=True)
    # round instead of group
    group = models.ForeignKey(Group, related_name='games', blank=True, null=True)
    field = models.ForeignKey(Field)
    roster1 = models.ForeignKey(Roster, blank=True, null=True, related_name='+')
    roster2 = models.ForeignKey(Roster, blank=True, null=True, related_name='+')

    # if we don't know the teams, and it's a group game we may know the 
    # positions which play each other
    pos1 = models.IntegerField(blank=True, null=True)
    pos2 = models.IntegerField(blank=True, null=True)
    start = models.DateTimeField()
    length = models.PositiveIntegerField()
    points1 = models.PositiveIntegerField(default=0)
    points2 = models.PositiveIntegerField(default=0)
    state = models.ForeignKey(GameState)

    def home_display(self):
        if self.roster1:
            return self.roster1.name
        group_type = ContentType.objects.get_for_model(Group)
        game_type = ContentType.objects.get_for_model(Game)
        try:
            qual = Link.objects.get(content_type_to=game_type,
                                    object_id_to=self.id,
                                    position_to=1)
        except Link.DoesNotExist:
            if self.group is None or self.pos1 is None:
                return '?'
            else:
              return '%s%s' % (self.group.code_name,
                               self.pos1)
        if qual.content_type_from.id == group_type.id:
            code1 = '%s%s' % (qual.qualifies_from.code_name,
                              qual.position_from)
            return code1
        if qual.content_type_from.id == game_type.id:
            t = 'l' if qual.position_from == 2 else 'w'
            code1 = '%s%s' % (qual.qualifies_from.code_name,
                              t)
            return code1
        return '??'

    def away_display(self):
        if self.roster2:
            return self.roster2.name
        group_type = ContentType.objects.get_for_model(Group)
        game_type = ContentType.objects.get_for_model(Game)
        try:
            qual = Link.objects.get(object_id_to=self.id, position_to=2)
        except Link.DoesNotExist:
            if self.group is None or self.pos2 is None:
                return '?'
            else:
              return '%s%s' % (self.group.code_name,
                               self.pos2)
        if qual.content_type_from.id == group_type.id:
            code1 = '%s%s' % (qual.qualifies_from.code_name,
                              qual.position_from)
            return code1
        if qual.content_type_from.id == game_type.id:
            t = 'L' if qual.position_from == 2 else 'W'
            code1 = '%s%s' % (qual.qualifies_from.code_name,
                              t)
            return code1
        return '??'
        return code1

    def __str__(self):
        return 'Game %s vs %s at %s' % (self.home_display(),
                                        self.away_display(),
                                        self.group)


class GameMomentType(TrackerModel):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class GameMoment(TrackerModel):
    game = models.ForeignKey(Game, related_name='moments')
    moment_type = models.ForeignKey(GameMomentType)
    player1 = models.ForeignKey(Person, blank=True, null=True, related_name='+')
    player2 = models.ForeignKey(Person, blank=True, null=True, related_name='+')
    team = models.ForeignKey(Roster, blank=True, null=True, related_name='+')
    time = models.PositiveIntegerField()
    desc = models.CharField(max_length=200, blank=True, null=True)

