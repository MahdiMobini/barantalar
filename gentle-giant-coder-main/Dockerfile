FROM node:20-alpine
WORKDIR /app

# نصب پکیج‌ها
COPY package*.json ./
RUN npm ci

# کپی سورس کد و بیلد گرفتن پروژه
COPY . .
RUN npm run build

# تنظیم متغیرهای محیطی برای اجرای صحیح سرور Node
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

# دستور اجرای سرور SSR
CMD ["npm", "run", "preview"]