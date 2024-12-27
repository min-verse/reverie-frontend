import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import NewNewReverieNav from "~/components/NewNewReverieNav";
import { getUserProfile, retrieveUserDetails } from "~/data";
import { commitSession, requireUserSession } from "~/services/session.server";
// import { requireUserSession } from "~/services/session.server";

export async function loader({
    request
}: LoaderFunctionArgs){
    const session = await requireUserSession(request);

    const localProfile = await retrieveUserDetails(session);
    const userProfile = await getUserProfile(request);

    const flashMessage = session.get("updateStorySuccess") || null;

    return json({ userProfile, localProfile, flashMessage }, {
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    });
}

export default function Profile(){
    const { userProfile, localProfile, flashMessage } = useLoaderData<typeof loader>();

    return(
        <div>
            <NewNewReverieNav userProfile={localProfile} />
            {
                flashMessage ?
                    <p><span style={{color:'green'}}>{flashMessage}</span></p>
                :
                null
            }
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
                <Link to={`/profile/edit`}>Edit Avatar URL</Link>
                <Outlet />
            </div>
        </div>
    );
}