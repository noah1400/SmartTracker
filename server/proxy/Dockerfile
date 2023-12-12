FROM nginx:alpine

# Install OpenSSL
RUN apk --no-cache add openssl

# Create a directory for the certificates
RUN mkdir -p /etc/nginx/certs

# Generate a Self Signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
    -keyout /etc/nginx/certs/selfsigned.key \
    -out /etc/nginx/certs/selfsigned.crt \
    -subj "/C=DE/ST=Baden Wuerttemberg/L=Esslingen am Neckar/O=SmartTracker/OU=backend dev/CN=www.smarttracker.de"

# Copy Nginx configuration file
COPY conf /etc/nginx/conf.d/default.conf

# Expose ports for HTTP and HTTPS
EXPOSE 80 443
