# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-09-08 09:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0002_country_icon'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='url',
            field=models.CharField(blank=True, max_length=128, verbose_name='Ссылка'),
        ),
    ]
