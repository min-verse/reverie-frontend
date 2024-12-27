import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { retrieveUserDetails, UserProfile, UserProfilePayload, updateUserProfile } from "~/data";
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

    const firstName = String(formData.get('firstName'));
    const lastName = String(formData.get('lastName'));
    const avatarUrl = String(formData.get('avatarUrl'));

    if(!avatarUrl){
        return json({ error: 'No URL provided for new avatar picture' });
    }

    const profileUpdatePayload: UserProfilePayload = {
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
    }

    const updateResponse = await updateUserProfile(request, profileUpdatePayload);

    if('error' in updateResponse){
        return json({ error: updateResponse['error']} );
    }

    session.set('avatar_url', String(formData.get('avatarUrl')))
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
                    <span>Edit First Name</span>
                    <input
                        name="firstName"
                        placeholder="Change your profile's first name"
                        type="text"
                    />
                </label>
                <label>
                    <span>Edit Last Name</span>
                    <input
                        name="lastName"
                        placeholder="Change your profile's first name"
                        type="text"
                    />
                </label>
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