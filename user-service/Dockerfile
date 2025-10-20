# Hangi nodejs sürümü
FROM node:18

# conatiner içinde çalışma klasörü
WORKDIR /app

# package.json kopyalanır
COPY package*.json ./

# bağımlılıklar yüklenir
RUN npm install

# tüm proje kopyalanır
COPY . .

# Dışarıya hangi portun dinleneceğini belirtilir
EXPOSE 3000

# Servisi başlatacak komutu belirtilir
CMD ["npm", "start"]