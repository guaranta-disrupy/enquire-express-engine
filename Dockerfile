FROM docker.io/library/node:20 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM docker.io/library/caddy:2.8

WORKDIR /usr/share/caddy

COPY --from=builder /app/dist .

EXPOSE 80

# CMD ["caddy", "file-server", "--listen", "0.0.0.0:9000"]
