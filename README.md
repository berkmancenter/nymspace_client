# Threads Client

## Running project for production

- Add `.env` file to the root of project with following key and and values to point to the threads server api and websocket

```
VITE_API_SERVER_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_WEBSOCKET_SERVER_URL=http://localhost:5555
```

- Install the packages by running following command on root of project

```
yarn
```

- For building the project for deployment, run the command

```
yarn build
```

The built files are put to the `dist` directory. These files can be served using any web server.

---

## Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
