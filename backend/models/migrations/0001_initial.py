# Generated by Django 3.0.6 on 2020-05-09 07:15

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('file', models.ImageField(upload_to='static/images')),
                ('inserted_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                'db_table': 'image',
            },
        ),
        migrations.CreateModel(
            name='Box',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coordinates', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('label', models.CharField(blank=True, max_length=100, null=True)),
                ('label_probability', models.FloatField(blank=True, null=True)),
                ('inserted_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('image_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='models.Image')),
            ],
            options={
                'db_table': 'box',
            },
        ),
    ]
