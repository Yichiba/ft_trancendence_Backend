FROM debian:bullseye

EXPOSE 443 
RUN apt-get update -y && apt-get install -y nginx openssl procps 
WORKDIR /etc/nginx/

COPY conf nginx.conf

COPY setup.sh setup.sh

RUN chmod +x setup.sh

ENTRYPOINT ["./setup.sh"]

CMD ["nginx", "-g", "daemon off;"]