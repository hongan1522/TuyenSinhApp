# Generated by Django 5.0.4 on 2024-06-15 16:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tuyenSinh', '0010_remove_question_tuvanvien_answer'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='answered_at',
        ),
    ]