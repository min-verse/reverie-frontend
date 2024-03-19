import { createCookieSessionStorage } from "@remix-run/node";

// Exporting the whole sessionStorage Object
export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "exampleSession",
        sameSite: "lax", // in production, this should be 'Strict'
        path: "/",
        httpOnly: true, // Enabling only HTTP Cookies
        secrets: ["blahblahblah"], // Should be an actual secret in .env
        secure: false, // Enable this as true in production
    }
});

export let { getSession, commitSession, destroySession } = sessionStorage;