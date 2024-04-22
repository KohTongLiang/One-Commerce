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

router.use('/*', shopify.validateAuthenticatedSession())
router.use(shopify.cspHeaders())
router.use('/*', shopify.ensureInstalledOnShop(), async (req, res, next) => {
    return res.status(500).send("Shop not installed")
})

router.get("/products/count", async (_req, res) => {
    const countData = await shopify.api.rest.Product.count({
        session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
});

export default router