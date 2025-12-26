FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 6000

# Run the app directly using ts-node
CMD ["npx", "ts-node", "src/app.ts"]
