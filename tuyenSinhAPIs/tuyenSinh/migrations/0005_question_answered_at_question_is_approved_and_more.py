# Generated by Django 5.0.4 on 2024-06-15 06:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tuyenSinh', '0004_question_answer'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='answered_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='question',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='question',
            name='tuvanvien_answer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tuvanvien_answer', to='tuyenSinh.tuvanvien'),
        ),
    ]
