# Fullstack E-Commerce: Angular, Express.js, MongoDB, Mongoose, Stripe and TailwindCSS

![image](https://github.com/user-attachments/assets/8944d135-b8ca-4e1d-bbc3-effe804338c9)

## Prerequisites

**Node version 20.x.x**
**Angular CLI 18.x.x**

## Setting up the project

### Cloning the repository

```shell
git clone https://github.com/psuarezdev/angular-ecommerce.git
```

### Install packages

```shell
cd ecommerce
npm i -E
cd ../ecommerce-api
npm i -E
```

### Setup .env files

#### Angular

```shell
ng generate environments
```

```js
// environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:<your-api-port>/api'
};

```

#### Express.js


```js
PORT=
CLIENT_URL=
JWT_SECRET=
STRIPE_SECRET=
// This is the checkout webhook secret
STRIPE_WEBHOOK_SECRET=
```

### Start the app

```shell
cd ecommerce-api
npm run dev
cd ../ecommerce
npm start
```
