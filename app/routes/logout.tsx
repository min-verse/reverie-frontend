import {
    ActionFunctionArgs,  
    redirect} from "@remix-run/node";
import { logout } from "~/data";
import { destroySession, getSession } from "~/services/session.server";

export const loader = async()=>{
    return null;
}

export const action = async({
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