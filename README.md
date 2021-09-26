# Microservice-example
A simple example of implementing micro-services with nodejs.

The project contains following six components:
1. [A react app (client)](#client)
2. [A posts service](#posts)
3. [A comments service](#comments)
4. [A query service](#query)
5. [A moderation service](#moderation)
6. [An event broker](#event-broker)

#### Client
A SPA created with create-react-app that allows to create new posts as well as add comments to existing posts.

#### Posts
A simple microservice to handle creation of new posts. It maintains an in memory store of the posts created.

#### Comments
A microservice to handle creation of new comments, maintain an in memory store for comments for a given post.

#### Query
A microservice to provide a single endpoint for getting a list of posts and their associated comments.

#### Moderation
A sample microservice for implementing moderation of comments.

#### Event Broker
A custom implementation of a basic event broker.

**All the components contain a Dockerfile to create a docker image to run the component**


### Running a container
To run any component inside a docker container:
1. Check into component directory and create a docker image
```
cd <component_name> && docker build -t your_dockerhub_username/<component_name> .
```
For eg,
```
cd posts && docker build -t my-name/posts .
```
2. Spin up a container with given image
```
docker run <image_name>
```
For eg,
```
docker run my-name/posts
```
