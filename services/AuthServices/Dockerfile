FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

# Run the app directly using ts-node
CMD ["npx", "ts-node", "src/app.ts"]
