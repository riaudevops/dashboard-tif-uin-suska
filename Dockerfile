# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .

# Set environment variables
ARG VITE_AUTHORITY
ARG VITE_CLIENT_ID
ARG VITE_CLIENT_SECRET
ENV VITE_AUTHORITY=$VITE_AUTHORITY
ENV VITE_CLIENT_ID=$VITE_CLIENT_ID
ENV VITE_CLIENT_SECRET=$VITE_CLIENT_SECRET

# Build application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application from build stage
COPY --from=builder /app/dist ./dist

# Install serve as global package
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Run serve command to start application
CMD [ "serve", "-s", "dist", "-l", "3000" ]