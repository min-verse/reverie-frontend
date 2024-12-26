import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { getStory, updateStory, retrieveUserDetails, UserProfile } from "~/data";
import { Form, useNavigate, useLoaderData, useActionData } from "@remix-run/react";
import NewNewReverieNav from "~/components/NewNewReverieNav";
import invariant from "tiny-invariant";
import { requireUserSession, commitSession } from "~/services/session.server";

export async function loader({
    params,
    request,
}: LoaderFunctionArgs){
  const storyId = params.storyId;
  const session = await requireUserSession(request);
  const story = await getStory(request, Number(storyId));
  const userProfile: UserProfile = await retrieveUserDetails(session);
  return json({ story, userProfile })
}

export async function action({
    params,
    request
}: ActionFunctionArgs){
    invariant(params.storyId, "Missing storyId param");
    const session = await requireUserSession(request);
    const formData = await request.formData();

    const updateResponse = await updateStory(request, Number(params.storyId), Object.fromEntries(formData));
    if('error' in updateResponse){
        return json({ error: updateResponse['error']} );
    }

    session.flash('updateStorySuccess', `Successfully updated story ${params.storyId}`);

    return redirect(`/story/${params.storyId}`, { 
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    });
}

export default function StoryEdit(){
    const { story, userProfile } = useLoaderData<typeof loader>();
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
            <Form key={story.id} method="post">
                <label>
                    <span>Title</span>
                    <input
                    defaultValue={story.title}
                    name="title"
                    placeholder="Title your story"
                    type="text"
                    />
                </label>
                <label>
                    <span>Subtitle</span>
                    <input
                    defaultValue={story.subtitle}
                    name="subtitle"
                    placeholder="Elaborate on the title"
                    type="text"
                    />
                </label>
                <label>
                    <span>Summary</span>
                    <input
                    defaultValue={story.summary}
                    name="summary"
                    placeholder="Summarize your story here"
                    type="text"
                    />
                </label>
                <label>
                    <span>Plot</span>
                    <textarea
                        name="plot"
                        defaultValue={story.plot}
                        placeholder="Explain your plot here"
                        rows={4}
                        cols={40}
                        />
                    
                </label>
                <label>
                    <span>Medium</span>
                    <select name="medium" defaultValue={story.medium}>
                        <option disabled>--Please Select a Medium--</option>
                        <option value="gn">Graphic Novel</option>
                        <option value="bk">Book</option>
                        <option value="sh">Short Story</option>
                        <option value="nv">Novel</option>
                        <option value="na">Novella</option>
                        <option value="cc">Comic</option>
                        <option value="mn">Manga</option>
                        <option value="sh">TV Show</option>
                        <option value="ot">Other</option>
                    </select>
                </label>
                <label>
                    <span>Privacy</span>
                    <select name="privacy" defaultValue={story.privacy}>
                        <option disabled>--Please Select a Privacy Status--</option>
                        <option value="pub">Public</option>
                        <option value="pri">Private</option>
                    </select>
                </label>
                <button type="submit">Submit Edits</button>
                <button type="button" onClick={() => navigate(`/story/${story.id}`)}>Cancel Edits</button>
            </Form>
        </>
    )
}