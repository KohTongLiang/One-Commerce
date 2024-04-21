# Google AI Hackathon Project

## Description

The application provides a platform for user to upload an image of a product they wish to sell on a e-commerce store by generating relevant product information with just the image alone. The user can then copy the details and paste into the respective e-commerce platform of their choice. Integration with existing e-commerce platforms to allow direct uploading of product is being explored.

## To run the Project

### Pre-requisite

Setup environmental file with the following

```text
PORT=<your port of choice>
GOOGLE_AI_API_KEY=<API key from Google>
GOOGLE_AI_MODEL=<gemini-pro or gemini-pro-vision>
SHOPIFY_CLIENT_ID=
SHOPIFY_CLIENT_SECRET=
HOSTNAME=h
SHOPIFY_STORE_DOMAIN=
```

Additionally ensure that ngrok is installed and running.

### Dev environment

The usual JavaScript commands

```bash
npm install

npm run build-css

npm run dev
```

### Production env

```bash
npm run build-css

npm run build

npm run dev
```
