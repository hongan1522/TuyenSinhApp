# Generated by Django 5.0.4 on 2024-05-29 07:43

import tuyenSinh.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tuyenSinh', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='thisinh',
            name='birthday',
            field=models.DateField(validators=[tuyenSinh.models.validate_birthday]),
        ),
    ]
