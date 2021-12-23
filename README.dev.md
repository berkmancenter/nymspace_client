# Running Project

## Backend

### Using Docker

- Checkout `dev` as working branch (this is temporary until changes from `dev` are merged to `main` branch)
- Create file `.env.local` and copy contents of `.env.example`. Feel free to change the port number in the file but make sure to make changes on fronend env file to reflect the correct port number. Also, if you change the port number, make sure to change the port numbers in `docker-compose.yml` as well. The port number for socket io is defined implicitly in the app as `5555` and can be changed by making change to file `/src/websockets/index.js`
- Edit `docker-compose.dev.yml` file to add

```
    env_file:
      - .env.local
```

the full content should look like this after adding the above changes

```
version: '3'

services:
  node-app:
    container_name: node-app-dev
    command: yarn dev -L
    env_file:
      - .env.local

```

- Run below docker compose command to start the server

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Frontend

- Checkout `dev` as working branch (this is temporary until changes from `dev` are merged to `main` branch)
- Run `yarn` to install packages. Or run it whenever there are packages added to `package.json`
- At this point running `yarn dev --port 3001`, application can be loaded using URL localhost:3001. No data will be loaded since we have not configured backend URLs. Cancel the process using `Ctrl+C`
- To connect backend, create file `.env.local` and copy contents of `.env.sample`. Replace URLs as below. Make sure the ports are correctly configured in threads server.

```
VITE_API_SERVER_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_WEBSOCKET_SERVER_URL=http://localhost:5555
```

- Run `yarn dev --port 3001` again and browse the app. Make sure the threads server project is running too.
