# Stage 1: Build Angular app
FROM node:20 AS build

WORKDIR /app

# Copiamos package.json y package-lock.json e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Build para producción
# --- CORRECCIÓN CLAVE: Agregamos --base-href / ---
RUN npx ng build --configuration production --base-href /

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiamos el build de Angular a Nginx
# Copiamos todo el contenido dentro de browser a Nginx
COPY --from=build /app/dist/nortoleocenter_frontend/browser/ /usr/share/nginx/html/

# Copiamos nuestro nginx.conf personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
