FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
CMD ["node", "--import", "tsx", "index.ts"]
