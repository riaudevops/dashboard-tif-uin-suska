FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .

ARG VITE_AUTHORITY
ARG VITE_CLIENT_ID
ARG VITE_CLIENT_SECRET
ENV VITE_AUTHORITY=$VITE_AUTHORITY
ENV VITE_CLIENT_ID=$VITE_CLIENT_ID
ENV VITE_CLIENT_SECRET=$VITE_CLIENT_SECRET

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist

RUN npm install -g serve


EXPOSE 3000

CMD [ "serve", "-s", "dist", "-l", "3000" ]