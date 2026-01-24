# Generated migration for SavedCandidate model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('recruiter', '0004_jobapplication'),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedCandidate',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('notes', models.TextField(blank=True, help_text='Private notes about this candidate', null=True)),
                ('saved_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('candidate', models.ForeignKey(limit_choices_to={'role': 'candidate'}, on_delete=django.db.models.deletion.CASCADE, related_name='saved_by_recruiters', to=settings.AUTH_USER_MODEL)),
                ('recruiter', models.ForeignKey(limit_choices_to={'role': 'recruiter'}, on_delete=django.db.models.deletion.CASCADE, related_name='saved_candidates', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Saved Candidate',
                'verbose_name_plural': 'Saved Candidates',
                'db_table': 'saved_candidates',
                'ordering': ['-saved_at'],
            },
        ),
        migrations.AlterUniqueTogether(
            name='savedcandidate',
            unique_together={('recruiter', 'candidate')},
        ),
    ]
