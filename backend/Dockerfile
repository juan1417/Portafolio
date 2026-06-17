# Stage 1 — build
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Cache deps first
COPY go.mod go.sum ./
RUN go mod download

# Source
COPY . .

# Static binary
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

# Stage 2 — minimal runtime
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/template ./template

EXPOSE 8080

CMD ["./server"]
