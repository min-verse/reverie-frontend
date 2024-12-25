import { json, type LoaderFunctionArgs, ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { createStory } from "~/data";
import ReverieNav from "~/components/ReverieNav";
import { requireUserSession } from "~/services/session.server";


export const loader = async({
  request,
}: LoaderFunctionArgs ) => {
  await requireUserSession(request);

  // const userProfile = await getUserProfile(request);

  // const stories = null;
  return null;
}

export const action = async({
    request,
  }: ActionFunctionArgs ) => {
    const session = await requireUserSession(request);
    if(!session){
        return redirect("/unauthenticated");
    }

    const formData = await request.formData();
    console.log(Object.fromEntries(formData));

    const storyData = {
        title: String(formData.get('title')),
        subtitle: String(formData.get('subtitle')),
        plot: String(formData.get('plot')),
        summary: String(formData.get('summary')),
        privacy: String(formData.get('privacy')),
        medium: String(formData.get('medium')),
        other_medium: String(formData.get('other_medium')),
    }

    const storyResponse = await createStory(request, storyData);

    console.log(`This is the response: ${JSON.stringify(storyResponse)}`);
    if("error" in storyResponse){
        return json({ storyResponse });
    }
  
    // const stories = null;
    return redirect('/home');
  }

export default function WriteStory() {
    // const { userProfile } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const actionData = useActionData<typeof action>();

  return (
    <>
        <ReverieNav />
        {
            actionData && actionData?.storyResponse && actionData?.storyResponse?.error ?
            <p><span style={{color:'red'}}>{actionData?.storyResponse?.error}</span></p>
            :
            null
        }
        <Form method="post">
                <label>
                    <span>Title</span>
                    <input
                    name="title"
                    placeholder="Title your story"
                    type="text"
                    />
                </label>
                <label>
                    <span>Subtitle</span>
                    <input
                    name="subtitle"
                    placeholder="Elaborate on the title"
                    type="text"
                    />
                </label>
                <label>
                    <span>Summary</span>
                    <input
                    name="summary"
                    placeholder="Summarize your story here"
                    type="text"
                    />
                </label>
                <label>
                    <span>Plot</span>
                    <textarea
                        name="plot"
                        placeholder="Explain your plot here"
                        rows={4}
                        cols={40}
                        />
                    
                </label>
                <label>
                    <span>Medium</span>
                    <select name="medium">
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
                    <select name="privacy">
                        <option disabled>--Please Select a Privacy Status--</option>
                        <option value="pub">Public</option>
                        <option value="pri">Private</option>
                    </select>
                </label>
                <button type="submit">Create Story</button>
                <button type="button" onClick={() => navigate(`/home`)}>Cancel Story</button>
            </Form>
    </>
  );
}
