FROM node:22-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

EXPOSE 5173

# Bind to 0.0.0.0 so the dev server is reachable from the host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
