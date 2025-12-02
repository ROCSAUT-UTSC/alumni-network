FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 3000

# Dev server for the team (hot reload)
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]
