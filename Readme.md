# One Commerce

Streamline your e-commerce listing process with our innovative app. One-Commerce leverages gemini to generate compelling product descriptions from a simple image.

## Description

The application provides a platform for user to upload an image of a product they wish to list on a e-commerce store, by generating relevant product information. Integration with existing e-commerce platforms to allow direct uploading of product is being explored to streamline the process to add products to e-commerce store directly.

### Features

* Upload image to get your descriptions

### Unfinished Feature

* Shopify integration - automatically list your product once you are happy with the descriptions generated.

## To run the Project

### Pre-requisite

Setup environmental file with the following

```text
PORT=<port where the app will listen on>
GOOGLE_AI_API_KEY=<API key from Google>
GOOGLE_AI_MODEL=<gemini-pro or gemini-pro-vision>
```

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

npm run start
```
