# Stage 1: Build the application
FROM node:20 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code to the working directory
COPY src/views/* ./
COPY . .

# Build the application
RUN npm run build-css
RUN npm run build

# Stage 2: Create a lightweight production image
FROM node:20-alpine AS production

# Set the working directory in the container
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=builder /app .

# Expose the port the app runs on
EXPOSE 8080
ENV PORT 8080

# Command to run the application
CMD ["node", "dist/index.js"]
