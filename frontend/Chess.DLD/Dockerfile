# Użyj obrazu Node.js
FROM node:18

# Ustaw katalog roboczy
WORKDIR /app

# Kopiowanie plików package.json i package-lock.json
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie reszty plików aplikacji
COPY . .

# Otwórz port 4200 (domyślny port dla Angular)
EXPOSE 4200

# Uruchom aplikację Angular w trybie deweloperskim
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]

