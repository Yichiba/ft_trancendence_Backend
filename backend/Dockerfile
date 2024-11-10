FROM debian:bullseye
RUN apt update -y && apt install python3-pip python3-venv -y

COPY authentication authentication
COPY media media
COPY start.sh start.sh

RUN chmod +x start.sh

CMD ["./start.sh"]
