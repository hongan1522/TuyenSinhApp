# Generated by Django 5.0.4 on 2024-06-15 06:01

import ckeditor.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tuyenSinh', '0003_alter_user_managers'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updates_date', models.DateTimeField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('question_text', ckeditor.fields.RichTextField()),
                ('is_frequently_asked', models.BooleanField(default=False)),
                ('thisinh', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='tuyenSinh.thisinh')),
            ],
            options={
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updates_date', models.DateTimeField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('answer_text', models.TextField()),
                ('tuvanvien', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='tuyenSinh.tuvanvien')),
                ('question', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='fk_question', to='tuyenSinh.question')),
            ],
            options={
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
    ]