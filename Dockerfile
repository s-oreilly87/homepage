FROM node:20-alpine

# Install git for the "pull on start" feature
RUN apk add --no-cache git

WORKDIR /app

# The entrypoint will handle pulling/building, so we just need the environment ready
# We copy package.json first to have dependencies in the image for faster first start
COPY package*.json ./
RUN npm install

# Copy entrypoint script explicitly
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Copy everything else (respecting .dockerignore)
COPY . .

# Expose Next.js default port
EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
