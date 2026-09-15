FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
ENV PRISMA_DATABASE_URL=postgresql://adidas:adidas_local@host.docker.internal:5432/adidas_product_prod
RUN npm ci

COPY . .

EXPOSE 5000

ENV PORT=5000
ENV HOSTNAME=0.0.0.0

CMD ["npm", "run", "dev"]
