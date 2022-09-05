FROM node:14-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package*.json .
RUN npm install
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD ["npm", "start"]


# docker build -t spice_vis .
# docker run it -p 8080:80 -rm spice_vis
# docker-compose -f docker-compose.dev.yml up
