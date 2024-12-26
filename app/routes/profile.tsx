import { json, LoaderFunctionArgs, SessionData } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import NewNewReverieNav from "~/components/NewNewReverieNav";
import { getUserProfile, retrieveUserDetails } from "~/data";
import { requireUserSession } from "~/services/session.server";
// import { requireUserSession } from "~/services/session.server";

export async function loader({
    request
}: LoaderFunctionArgs){
    const session: SessionData = await requireUserSession(request);

    const localProfile = await retrieveUserDetails(session);
    const userProfile = await getUserProfile(request);

    return json({ userProfile, localProfile });
}

export default function Profile(){
    const { userProfile, localProfile } = useLoaderData<typeof loader>();

    return(
        <div>
            <NewNewReverieNav userProfile={localProfile} />
            <div>
                <img
                    width={500}
                    height={500}
                    src={userProfile['avatar_url']}
                    alt={`${userProfile['username']}'s avatar`}
                />
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