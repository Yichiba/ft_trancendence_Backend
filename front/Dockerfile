FROM node:19-bullseye
RUN apt update && apt install python3-pip python3-venv -y 
COPY files files
COPY start.sh start.sh

RUN chmod +x start.sh

CMD ["./start.sh"]
