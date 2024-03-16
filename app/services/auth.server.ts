import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { Form } from "@remix-run/react";

import { login } from "~/data";

const setCookie = require('set-cookie-parser');

// TODO: Define a type for Authenticator like Authenticator<Type>
let authenticator =  new Authenticator(sessionStorage);
authenticator.use(
    new FormStrategy( async({form})=>{
        let username = String(form.get("username"));
        let password = String(form.get("password"));
        // TODO: let user = login(username, password)
        // where login() is a call to external API
        let credentials = {
            username: username,
            password: password
        };

        const response = await login(username, password);

        const setCookieHeader = response.headers.get('Set-Cookie');

        if(!setCookieHeader){
            throw new Error('No session or cookie found for Set-Cookie, unable to authenticate');
        }

        const parsedResponseCookies = setCookie.parse(
            setCookie.splitCookiesString(setCookieHeader)
        );

        console.log(`This is the parsed cookie` + parsedResponseCookies);

        // TODO: What structure is this cookie
        const sessionIdCookie = parsedResponseCookies.find(
            (cookie: {
                name: string,
            }) => cookie.name === 'sessionid'
        );

        return credentials;
    }),
    "user-pass"
);

export { authenticator };