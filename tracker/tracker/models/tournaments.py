from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType
from tracker.models.core import TrackerModel, PositionalModel
from tracker.models.events import Roster, EventDivision, Event

class LinkType(TrackerModel):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Link(TrackerModel):
    link_type = models.ForeignKey(LinkType)

    limit = models.Q(app_label = "tracker", model = 'game') | models.Q(app_label = "tracker", model = 'group')
    content_type_from = models.ForeignKey(ContentType,
                                          limit_choices_to = limit | models.Q(app_label = 'tracker', model = 'roster'),
                                          related_name='+')
    object_id_from = models.PositiveIntegerField()
    #links_from
    qualifies_from = generic.GenericForeignKey('content_type_from',
                                               'object_id_from') # game / group
    position_from = models.PositiveIntegerField(blank=True, null=True)
    content_type_to = models.ForeignKey(ContentType,
                                        limit_choices_to = limit,
                                        related_name='+')
    object_id_to = models.PositiveIntegerField()
    #links_to
    qualifies_to = generic.GenericForeignKey('content_type_to',
                                             'object_id_to') # game / group
    position_to = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return 'Link from %s to %s' % (self.qualifies_from,
                                       self.qualifies_to)

# this should be more generic. Stage may exist only in one cluster
class Cluster(TrackerModel):
    """
    Elite / Challenger
    """
    name = models.CharField(max_length=200)
    parent = models.ForeignKey("Cluster", blank=True, null=True)
    # stage?
    event_division = models.ForeignKey(EventDivision)

    def __str__(self):
        return self.name

class StageType(TrackerModel):
    """
    Group
    Elimination
    Bucket
    Seeding
    Standings
    """
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Stage(PositionalModel):
    """
    Group stage
    Elimination stage
    """
    name = models.CharField(max_length=200, blank=True, null=True)
    code_name = models.CharField(max_length=200, blank=True, null=True)
    stage_type = models.ForeignKey(StageType, blank=True, null=True)
    parent = models.ForeignKey("Stage", blank=True, null=True)
    event_division = models.ForeignKey(EventDivision, related_name="stages")
    cluster = models.ForeignKey(Cluster, blank=True, null=True)

    def __str__(self):
        return 'Stage: %s of %s' % (self.name, self.event_division)

    """
    def direct_groups(self):
        return self.groups.filter(parent__isnull=True)
    """


class Group(PositionalModel):
    name = models.CharField(max_length=200, blank=True, null=True)
    code_name = models.CharField(max_length=200, blank=True, null=True)
    parent = models.ForeignKey("Group", blank=True, null=True)
    stage = models.ForeignKey(Stage, related_name="groups")
    cluster = models.ForeignKey(Cluster, blank=True, null=True)
 
    """
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
    """

    def __str__(self):
        return 'Group: %s of %s' % (self.name, self.stage)

class GroupRoster(PositionalModel):
    squad = models.ForeignKey(Roster)
    group = models.ForeignKey(Group, related_name="rosters")

    def __str__(self):
        return "%s in group %s (#%s)" % (self.squad,
                                         self.group,
                                         self.pos)


class Round(PositionalModel):
    """
    In Group/Ladder: round 1 games, round 2
    """
    name = models.CharField(max_length=200, blank=True, null=True)
    code_name = models.CharField(max_length=200, blank=True, null=True)
    group = models.ForeignKey(Group, blank=True, null=True)

    def __str__(self):
        return self.name

class FieldType(TrackerModel):
    """
    grass, art. grass
    """
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Field(TrackerModel):
    name = models.CharField(max_length=200)
    field_type = models.ForeignKey(FieldType)
    event = models.ForeignKey(Event)

    def __str__(self):
        return self.name
