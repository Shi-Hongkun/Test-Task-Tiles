FROM node:18-bullseye-slim

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Install basic development tools and node-gyp dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    bash \
    python3 \
    build-essential \
    ca-certificates \
    apt-transport-https \
    gnupg \
    lsb-release \
    netcat \
    && rm -rf /var/lib/apt/lists/*

# Install Docker CLI
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli docker-compose-plugin \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Set permissions for workspace (node user already exists in base image)
RUN chown -R node:node /workspace

# Switch to node user
USER node

# Set default shell to bash
SHELL ["/bin/bash", "-c"]

# Keep container running
CMD ["sleep", "infinity"] 