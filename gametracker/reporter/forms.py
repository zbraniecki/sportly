from django.forms import ModelForm
from tracker.models.games import GameMoment


class AddActionForm(ModelForm):
    class Meta:
        model = GameMoment
        fields = ['moment_type', 'team']
