FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Créer les dossiers temporaires et donner les permissions
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp && \
    chown -R app:app /var/cache/nginx /usr/share/nginx/html /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown app:app /var/run/nginx.pid

USER app
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
