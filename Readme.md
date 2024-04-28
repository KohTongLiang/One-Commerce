# One Commerce

Streamline your e-commerce listing process with our innovative app. One-Commerce leverages gemini to generate compelling product descriptions from a simple image.

## Features

### Features

- Upload image to get your descriptions

### Unfinished Feature

- Shopify integration - automatically list your product once you are happy with the descriptions generated.

## To run the Project

### Pre-requisite

Setup environmental file with the following

```text
PORT=<port where the app will listen on>s
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

node dist/index.js
```

# References

- [Loading Spinner](https://icons8.com/icons/set/spinner)
