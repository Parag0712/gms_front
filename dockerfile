# Use Node.js 18 as base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .
# Set environment variables
ENV PORT=4000

# Run Prisma migrations (adjust the command to your needs)

# Build the Next.js app
RUN npm run build

# Expose the app port
EXPOSE 4000


# Run the app
CMD ["npm", "start"]