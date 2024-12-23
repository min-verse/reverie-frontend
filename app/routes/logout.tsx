import { json, 
    ActionFunctionArgs, 
    LoaderFunctionArgs, 
    CookieParseOptions, 
    CookieSerializeOptions, 
    redirect} from "@remix-run/node";
import { login, logout } from "~/data";
import { Form } from "@remix-run/react";
import setCookie from "set-cookie-parser";
import { commitSession, destroySession, getSession } from "~/services/session.server";

export const loader = async({
    request,
}: LoaderFunctionArgs)=>{
    return null;
}

export const action = async({
    params,
    request
}: ActionFunctionArgs)=>{
    console.log("Reached the beginning of the action method");
    const session = await getSession(
        request.headers.get("Cookie")
    );
    console.log("Reached this part of the logout action");

    await logout(request);

    // TODO: Update this to destroySession
    return redirect("/login", {
        headers: {
        "Set-Cookie": await destroySession(session),
        },
    });
};