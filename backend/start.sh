#! /bin/bash
if [ -d ".venv" ]; then
    echo "env exist"
    source .venv/bin/activate
else
    python3 -m venv .venv
    source .venv/bin/activate
    pip3 install -r authentication/requirement_home.txt
fi

python3 authentication/manage.py  runserver