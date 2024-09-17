const admin = require("firebase-admin");
import dotenv from "dotenv";

dotenv.config();

const serviceAccountKey = {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: "googleapis.com",
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: process.env.DB_URL,
});

const db = admin.firestore();

module.exports = db;