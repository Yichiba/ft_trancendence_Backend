# Generated by Django 4.2.16 on 2024-11-12 07:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0002_room_user1_room_user2_alter_room_room_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='user1',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='room',
            name='user2',
            field=models.CharField(max_length=50),
        ),
    ]
