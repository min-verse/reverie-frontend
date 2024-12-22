import { createCookieSessionStorage, redirect } from "@remix-run/node";

// Exporting the whole sessionStorage Object
export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "sessionid",
        sameSite: "lax", // in production, this should be 'Strict'
        path: "/",
        httpOnly: true, // Enabling only HTTP Cookies
        secrets: ["blahblahblah"], // Should be an actual secret in .env
        secure: false, // Enable this as true in production
    }
});

export let { getSession, commitSession, destroySession } = sessionStorage;

export async function requireUserSession(request: Request){
    const session = await getSession(
        request.headers.get("Cookie")
      );

    if(!session.has('sessionid')){
        throw redirect('/login');
    }

    return session;
}