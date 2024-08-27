# Threads Client

## Description

This is the Frontend vue app which depends on the [berkmancenter/threads_server](https://github.com/berkmancenter/threads_client) repo to run.

## Installation

- Install and start [berkmancenter/threads_server](https://github.com/berkmancenter/threads_server).
- Come back to this repo and `yarn install` to install packages.
- Connect backend by copying `.env.example` to `.env.local`. Make sure the ports are correctly configured in threads_server repo.
- Run `yarn dev --port 3001` and browse the app at https://localhost:3001.

## Custom Base Path

You can add a `VITE_PATH=/your/base/path` env variable to the env file and this app will use that for routing.

## Tests

### Unit and integration tests

There are no unit or integration tests in this repo.

### Stress testing

Stress tests can be run from the client repo in the [k6 directory](https://github.com/berkmancenter/threads_client/blob/main/k6).
