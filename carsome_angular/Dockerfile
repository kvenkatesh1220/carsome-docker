FROM node AS carsome
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx
COPY --from=carsome /app/dist/carsome /usr/share/nginx/html
EXPOSE 80




# docker build -t carsome .
# docker run -d -p 4200:80 carsome       




# # Create image based on the official Node image from dockerhub
# FROM node
# # Create a directory where our app will be placed
# RUN mkdir -p /usr/src/app
# # Change directory so that our commands run inside this new directory
# WORKDIR /usr/src/app
# # Copy dependency definitions
# COPY package.json /usr/src/app
# # Install dependecies
# RUN npm install
# # Get all the code needed to run the app
# COPY . /usr/src/app
# # Expose the port the app runs in
# EXPOSE 4200
# # Serve the app
# CMD ["npm", "start"]