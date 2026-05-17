# homepage
My homepage - career focused

## Docker deploy

The container runs the standalone Next.js server on port `3001`.

```sh
docker compose up -d --build
```

Point Nginx Proxy Manager at `http://<nas-ip>:3001`.
