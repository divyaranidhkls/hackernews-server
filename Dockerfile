# Use official Node.js image (LTS version recommended)
FROM node:22.1.0

# Set working directory inside the container
WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install tsx globally (if needed)
RUN npm install -g tsx

# Copy rest of the application files
COPY . .

# Run Prisma client generation (only if Prisma is being used)
RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; fi

# Build the TypeScript app
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
