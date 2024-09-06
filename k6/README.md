# Nymspace Stess Testing

This stress test for [berkmancenter/threads_client](https://github.com/berkmancenter/threads_client) and [berkmancenter/threads_server](https://github.com/berkmancenter/threads_server) uses `k6` to spin up 300 headless browsers that randomly decide whether to create an account, and then start posting messages to the thread you specify for ten minutes.

## Getting started

### Install k6

https://grafana.com/docs/k6/latest/set-up/install-k6/

#### Mac

brew install k6

#### Debian/Ubuntu

```
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Running the test

Edit k6.js to add `loginUrl` and `threadUrl` variables that point to an instance of the threads_client. Then start the test:

```sh
k6 run k6.js
```
