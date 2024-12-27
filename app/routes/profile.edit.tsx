import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { retrieveUserDetails, UserProfile, updateUserProfile } from "~/data";
import { Form, useNavigate, useLoaderData, useActionData } from "@remix-run/react";
import NewNewReverieNav from "~/components/NewNewReverieNav";
import { requireUserSession, commitSession } from "~/services/session.server";

export async function loader({
    request,
}: LoaderFunctionArgs){
  const session = await requireUserSession(request);
  const userProfile: UserProfile = await retrieveUserDetails(session);
  return json({ userProfile })
}

export async function action({
    request
}: ActionFunctionArgs){
    const session = await requireUserSession(request);
    const formData = await request.formData();

    if(!formData.get('avatar_url')){
        return json({ error: 'No URL provided for new avatar picture' });
    }

    const updateResponse = await updateUserProfile(request, String(formData.get('avatar_url')));

    if('error' in updateResponse){
        return json({ error: updateResponse['error']} );
    }

    session.flash('updateProfileSuccess', `Successfully updated user's profile`);

    return redirect(`/profile`, { 
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    });
}

export default function StoryEdit(){
    const { userProfile } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    const navigate = useNavigate();

    return(
        <>
            <NewNewReverieNav userProfile={userProfile} />
            {
                actionData && actionData?.error ?
                <p><span style={{color:'red'}}>{actionData?.error}</span></p>
                :
                null
            }
            <Form key={userProfile.username} method="post">
                <label>
                    <span>Avatar URL</span>
                    <input
                        name="avatarUrl"
                        placeholder="Use another image as your avatar"
                        type="text"
                    />
                </label>
                <button type="submit">Submit Edits</button>
                <button type="button" onClick={() => navigate(`/profile`)}>Cancel Edits</button>
            </Form>
        </>
    )
}