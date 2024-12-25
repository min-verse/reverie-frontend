import { json, LoaderFunctionArgs, SessionData } from "@remix-run/node";
import { requireUserSession } from "~/services/session.server";
// import NewReverieNav from "./resources.new_reverie_nav";
import { useLoaderData } from "@remix-run/react";
import { UserProfile } from "~/data";
import NewNewReverieNav from "~/components/NewNewReverieNav";

export async function loader({request}: LoaderFunctionArgs){
    const session: SessionData = await requireUserSession(request);

    const userProfile: UserProfile = {
        username: session.get('username'),
        avatar_url: session.get('avatar_url')
    };

    return json({ userProfile });
}

export default function TestRoute(){
    const { userProfile } = useLoaderData<typeof loader>();

    return (
        <>
            <NewNewReverieNav userProfile={userProfile} />
        </>
    )
}