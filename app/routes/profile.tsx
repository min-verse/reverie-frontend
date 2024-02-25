import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import ReverieNav from "~/components/ReverieNav";
import { user } from "~/data";

export async function loader({
    params,
    request
}: LoaderFunctionArgs){
    return json({ user });
}

export default function Profile(){
    const { user } = useLoaderData<typeof loader>();

    return(
        <div>
            <ReverieNav user={user} />
            <div>
                <img src={user.picUrl} alt={`${user.username}'s profile picture`} />
                <p>{user.username}</p>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
}