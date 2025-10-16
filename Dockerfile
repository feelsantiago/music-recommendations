FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx nx build music-ai-server --prod

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist/apps/music-ai-server ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE $PORT

CMD ["node", "dist/main.js"]
