FROM node:19-bullseye
RUN apt update -y 
COPY files files
COPY start.sh start.sh

RUN chmod +x start.sh

CMD ["./start.sh"]
# CMD ["tail","-f","/dev/null"]
