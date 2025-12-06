FROM node:25-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

FROM node:25-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=deps /app/node_modules ./node_modules

EXPOSE 80

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["nginx", "-g", "daemon off;"]
