FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Install basic development tools
RUN apk add --no-cache git curl bash

# Install Docker CLI
RUN apk add --no-cache docker-cli docker-compose

# Set working directory
WORKDIR /workspace

# Create node user and set permissions
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/bash -D node \
    && chown -R node:node /workspace

# Switch to node user
USER node

# Set default shell to bash
SHELL ["/bin/bash", "-c"]

# Keep container running
CMD ["sleep", "infinity"] 