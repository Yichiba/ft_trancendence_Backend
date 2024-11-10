#! /bin/bash
python3 -m venv .env
source ./env/bin/activate
pip3 install authentication/requirement_home.txt
python3 authentication/manage.py  runserver
