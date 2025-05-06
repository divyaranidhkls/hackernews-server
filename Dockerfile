FROM node:20

WORKDIR /app

# Copy only needed files
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Copy Prisma folder (assuming .dockerignore is set correctly)
COPY . .

# Ensure Prisma engine uses binary instead of fetching native builds
ENV PRISMA_CLI_QUERY_ENGINE_TYPE="binary"

# Install dependencies
RUN npm install

# Generate Prisma client if schema exists
RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; else echo "Skipping prisma generate"; fi

# Build the TypeScript app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
