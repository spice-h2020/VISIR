FROM node:16-alpine AS build
LABEL autodelete-visir="true"
# Remove manually with:
# list=$(docker images -q -f "dangling=true" -f "label=autodelete-visir=true")
# if [ -n "$list" ]; then
#      docker rmi $list
# fi
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package*.json ./
RUN npm install
# Copy app files
COPY . ./
# Start the app
RUN npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
