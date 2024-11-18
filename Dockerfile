# Build stage
FROM node:18-alpine as builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the React app
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Install serve globally to serve the static files
RUN npm install -g serve

# Copy build output from the builder stage
COPY --from=builder /usr/src/app/build /usr/src/app/build

# Expose port 3000
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
