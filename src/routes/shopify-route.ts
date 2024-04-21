import express from "express";
import { createAdminRestApiClient } from '@shopify/admin-api-client';
import { shopifyApp } from '@shopify/shopify-app-express';
import { LATEST_API_VERSION } from "@shopify/shopify-api";


import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const client = createAdminRestApiClient({
    storeDomain: `${process.env.SHOPIFY_STORE_DOMAIN}`,
    apiVersion: LATEST_API_VERSION,
    accessToken: `${process.env.SHOPIFY_CLIENT_SECRET}`,
});

const shopify = shopifyApp({
    api: {
        apiKey: `${process.env.SHOPIFY_CLIENT_ID}`,
        apiSecretKey: `${process.env.SHOPIFY_CLIENT_SECRET}`,
        scopes: ['read_products'],
        hostScheme: 'http',
        hostName: `${process.env.HOSTNAME}`,
    },
    auth: {
        path: '/api/auth',
        callbackPath: '/api/auth/callback',
    },
    webhooks: {
        path: '/api/webhooks',
    },
});

// const shopify = shopifyApi({
//     apiVersion: LATEST_API_VERSION, 
//     billing: undefined, 
//     isEmbeddedApp: false,
//     apiKey: process.env.SHOPIFY_CLIENT_ID ?? "",
//     apiSecretKey: process.env.SHOPIFY_CLIENT_SECRET ?? "",
//     scopes: process.env.SHOPIFY_SCOPES?.split(',') ?? ['read_products'],
//     hostName: process.env.HOSTNAME ?? ""
// });

router.get(shopify.config.auth.path, shopify.auth.begin());
router.get(
    shopify.config.auth.callbackPath,
    shopify.auth.callback(),
    shopify.redirectToShopifyOrAppRoot(),
);
router.post(
    shopify.config.webhooks.path,
    // shopify.processWebhooks({webhookHandlers}),
);

router.get('/products', (req, res, next) => {
})
router.get('/getAllItems', shopify.validateAuthenticatedSession(), async (req, res, next) => {
    const result = await client.get('products');
    if (result.ok) {
        const body = await result.json()
        return res.send(body)
    } else {
        console.log(result)
        return res.send(result.statusText)
    }
})

export default router