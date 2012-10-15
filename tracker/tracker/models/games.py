from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

from tracker.models.core import TrackerModel, Person
from tracker.models.events import Squad, EditionDivision, Edition

class PhaseType(TrackerModel):
    """
    Group
    Elimination
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Phase(TrackerModel):
    """
    Group phase
    Elimination phase
    """
    name = models.CharField(max_length=200, blank=True, null=True)
    code_name = models.CharField(max_length=200, blank=True, null=True)
    phase_type = models.ForeignKey(PhaseType)
    parent = models.ForeignKey("Phase", blank=True, null=True)
    edition_division = models.ForeignKey(EditionDivision, related_name="phases")

    def __unicode__(self):
        return 'Phase: %s of %s' % (self.name, self.edition_division)

    def direct_groups(self):
        return self.groups.filter(parent__isnull=True)

class Group(TrackerModel):
    name = models.CharField(max_length=200, blank=True, null=True)
    code_name = models.CharField(max_length=200, blank=True, null=True)
    parent = models.ForeignKey("Group", blank=True, null=True)
    phase = models.ForeignKey(Phase, related_name="groups")
    squads = models.ManyToManyField(Squad, blank=True, null=True)
    qualifications_from = generic.GenericRelation("Qualification",
                                                  content_type_field="content_type_to",
                                                  object_id_field="object_id_to")

    def squads_display(self):
        squads = self.squads.all()
        if squads.count():
            s = []
            for squad in squads:
                teams = squad.team.all()
                if len(teams) == 1:
                    name = teams[0].name
                else:
                    name = ', '.join(map(teams, lambda x:x.name))
                s.append({'id': squad.id, 'name': name})
            return s
        ql = self.qualifications_from.all()
        squads = []
        for qual in ql:
            code = '%s%s' % (qual.qualifies_from.code_name,
                              qual.position_from)
            squad = {'id': qual.id, 'name': code}
            squads.append(squad)
        return squads

    def __unicode__(self):
        return 'Group: %s of %s' % (self.name, self.phase)

class Field(TrackerModel):
    name = models.CharField(max_length=200)
    edition = models.ForeignKey(Edition)

    def __unicode__(self):
        return self.name

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

    def __unicode__(self):
        return self.name

class Game(TrackerModel):
    code_name = models.CharField(max_length=200, blank=True, null=True)
    desc = models.CharField(max_length=200, blank=True, null=True)
    group = models.ForeignKey(Group, related_name='games')
    field = models.ForeignKey(Field)
    squad1 = models.ForeignKey(Squad, blank=True, null=True, related_name='+')
    squad2 = models.ForeignKey(Squad, blank=True, null=True, related_name='+')
    start = models.DateTimeField()
    length = models.PositiveIntegerField()
    points1 = models.PositiveIntegerField()
    points2 = models.PositiveIntegerField()
    state = models.ForeignKey(GameState)
    qualifications_from = generic.GenericRelation("Qualification",
                                                  content_type_field="content_type_to",
                                                  object_id_field="object_id_to")

    def home_display(self):
        if self.squad1:
            return self.squad1.name
        try:
            qual = self.qualifications_from.get(position_to=1)
        except Qualification.DoesNotExist:
            return '?'
        group_type = ContentType.objects.get_for_model(Group)
        if qual.content_type_from.id == group_type.id:
            code1 = '%s%s' % (qual.qualifies_from.name,
                              qual.position_from)
            return code1
        game_type = ContentType.objects.get_for_model(Game)
        if qual.content_type_from.id == game_type.id:
            t = 'l' if qual.position_from == 2 else 'w'
            code1 = '%s%s' % (qual.qualifies_from.name,
                              t)
            return code1
        return '??'

    def away_display(self):
        if self.squad2:
            return self.squad2.name
        try:
            qual = self.qualifications_from.get(position_to=2)
        except Qualification.DoesNotExist:
            return '?'
        group_type = ContentType.objects.get_for_model(Group)
        if qual.content_type_from.id == group_type.id:
            code1 = '%s%s' % (qual.qualifies_from.name,
                              qual.position_from)
            return code1
        game_type = ContentType.objects.get_for_model(Game)
        if qual.content_type_from.id == game_type.id:
            t = 'l' if qual.position_from == 2 else 'w'
            code1 = '%s%s' % (qual.qualifies_from.name,
                              t)
            return code1
        return '??'
        return code1

    def __unicode__(self):
        return 'Game %s vs %s at %s' % (self.home_display(),
                                        self.away_display(),
                                        self.group)

class Qualification(TrackerModel):
    limit = models.Q(model = 'game') | models.Q(model = 'group')
    content_type_from = models.ForeignKey(ContentType,
                                          limit_choices_to = limit,
                                          related_name='+')
    object_id_from = models.PositiveIntegerField()
    qualifies_from = generic.GenericForeignKey('content_type_from',
                                               'object_id_from') # game or group
    position_from = models.PositiveIntegerField()
    content_type_to = models.ForeignKey(ContentType,
                                        limit_choices_to = limit,
                                        related_name='+')
    object_id_to = models.PositiveIntegerField()
    qualifies_to = generic.GenericForeignKey('content_type_to',
                                             'object_id_to') # game or group
    position_to = models.PositiveIntegerField(blank=True, null=True)

    def __unicode__(self):
        return 'Qualification from %s to %s' % (self.qualifies_from,
                                                self.qualifies_to)

class GameMomentType(TrackerModel):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class GameMoment(TrackerModel):
    game = models.ForeignKey(Game, related_name='moments')
    moment_type = models.ForeignKey(GameMomentType)
    player1 = models.ForeignKey(Person, blank=True, null=True, related_name='+')
    player2 = models.ForeignKey(Person, blank=True, null=True, related_name='+')
    team = models.ForeignKey(Squad, blank=True, null=True, related_name='+')
    time = models.PositiveIntegerField()
    desc = models.CharField(max_length=200, blank=True, null=True)

