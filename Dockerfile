# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire Nx workspace
COPY . .

# Build the specific NestJS application
RUN npx nx build music-ai-server --prod

# Stage 2: Create the final production image
FROM node:22-alpine AS production

WORKDIR /app

# Copy only the built output and necessary package files
COPY --from=builder /app/dist/apps/music-ai-server ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port your NestJS application listens on (e.g., 3000)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/apps/music-ai-server/main.js"]
