import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import ReverieNav from "~/components/ReverieNav";
import { getUserProfile } from "~/data";
// import { requireUserSession } from "~/services/session.server";

export async function loader({
    request
}: LoaderFunctionArgs){
    const userProfile = await getUserProfile(request);
    return json({ userProfile });
}

export default function Profile(){
    const { userProfile } = useLoaderData<typeof loader>();

    return(
        <div>
            <ReverieNav />
            <div>
                <img src={userProfile['avatar_url']} alt={`${userProfile['username']}'s avatar`} />
                <p>{userProfile['username']}</p>
            </div>
            <div>
                {
                    userProfile && <p style={{color:'blue'}}>This is {userProfile['first_name']} {userProfile['last_name']} or {userProfile['username']}&apos;s profile</p>
                }
                <Outlet />
            </div>
        </div>
    );
}