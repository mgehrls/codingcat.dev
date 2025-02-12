import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

import {
    env as publicEnv,
} from '$env/dynamic/public';

import { env as privateEnv } from '$env/dynamic/private';

export let app = getApps().at(0);

let auth: Auth;
let db: Firestore;

if (!app && publicEnv.PUBLIC_FB_PROJECT_ID && privateEnv.PRIVATE_FB_CLIENT_EMAIL && privateEnv.PRIVATE_FB_PRIVATE_KEY) {
    app = initializeApp({
        credential: cert({
            projectId: publicEnv.PUBLIC_FB_PROJECT_ID,
            clientEmail: privateEnv.PRIVATE_FB_CLIENT_EMAIL,
            privateKey: privateEnv.PRIVATE_FB_PRIVATE_KEY
        })
    });

    auth = getAuth(app);
    db = getFirestore(app);
}

/* AUTH */

export const ccdCreateSessionCookie = async (idToken: string) => {
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    // Set cookie policy for session cookie.
    const options = { maxAge: expiresIn, httpOnly: true, secure: true };

    return {
        name: 'session',
        sessionCookie,
        options
    }
};

export const ccdValidateSessionCookie = async (session: string) => {
    return await auth.verifySessionCookie(session, true);
}

export const validateStripeRole = async (uid: string) => {
    const user = await auth.getUser(uid);
    return user.customClaims?.['stripeRole']
}

export const isAdmin = async (uid: string) => {
    // Check if user is admin
    const doc = await db.collection('admins').doc(uid).get();
    return doc.exists;
}

/* DB */

export const getStripeProducts = async () => {
    const products: any = [];
    if (!db) return products;

    const snapshot = await db.collection('stripe-products').where('active', '==', true).get();

    for (const doc of snapshot.docs) {
        const priceSnapshot = await doc.ref.collection('prices').where('active', '==', true).get();

        for (const price of priceSnapshot.docs) {
            products.push({
                id: doc.id,
                ...doc.data(),
                price: price.id
            })
        }
    }
    return products;
}