import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { getStory } from "~/data";
import { Form } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({
    params,
    request,
}: LoaderFunctionArgs){
  const storyId = params.storyId;
  const story = await getStory(Number(storyId));
  return json({ story })
}

export async function action({
    params,
    request
}: ActionFunctionArgs){
    invariant(params.storyId, "Missing contactId param");
    const formData = await request.formData();
    console.log(formData);
}

export default function StoryEdit(){
    const { story } = useLoaderData<typeof loader>();

    return(
        <>
            <Form>
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
                <button type="submit">Submit Edits</button>
                <button type="button">Cancel Edits</button>
            </Form>
        </>
    )
}