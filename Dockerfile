FROM node:22.1.0

WORKDIR /app

# Install dependencies before copying full source for better Docker caching
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Generate Prisma client (only if schema exists)
RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; fi

# Compile TypeScript to dist/
RUN npm run build

EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/index.js"]
