from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import CustomUser
from . import views
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = '__all__'

    def validate(self, data):
        if not data.get('42_login'):
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        user =CustomUser(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
        )
        
        if not validated_data.get('42_login'):
            user.set_password(validated_data['password'])  # Hash the password
        else:
            user.set_password(validated_data['password'])  # Hash the random password
        user.save()
        return user
