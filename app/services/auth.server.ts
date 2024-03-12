import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { Form } from "@remix-run/react";

// TODO: Define a type for Authenticator like Authenticator<Type>
let authenticator =  new Authenticator(sessionStorage);
authenticator.use(
    new FormStrategy( async({form})=>{
        let username = form.get("username");
        let password = form.get("password");
        // TODO: let user = login(username, password)
        // where login() is a call to external API
        let user = {
            username: username,
            password: password
        }

        return user;
    }),
    "user-pass"
);

export { authenticator };