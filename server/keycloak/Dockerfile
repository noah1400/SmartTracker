# Use the latest Keycloak image
FROM quay.io/keycloak/keycloak:latest

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Set the working directory to Keycloak's home directory
WORKDIR /opt/keycloak

# The following lines are for demonstration purposes only.
# You should use proper certificates in a production environment.
ARG KEYSTORE_PASSWORD
RUN keytool -genkeypair -storepass "$KEYSTORE_PASSWORD" -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore

# This command will build Keycloak with the provided configurations
RUN /opt/keycloak/bin/kc.sh build

# Default entrypoint
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--health-enabled=true"]
