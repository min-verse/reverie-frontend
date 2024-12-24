import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { getStory } from "~/data";
import { Form, useNavigate } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Tiptap from "~/components/Tiptap";

export async function loader({
    params,
    request,
}: LoaderFunctionArgs){
  const storyId = params.storyId;
  const story = await getStory(request, Number(storyId));
  return json({ story })
}

export async function action({
    params,
    request
}: ActionFunctionArgs){
    invariant(params.storyId, "Missing storyId param");
    const formData = await request.formData();
    console.log(Object.fromEntries(formData));

    return redirect(`/story/${params.storyId}`);
}

export default function StoryEdit(){
    const { story } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return(
        <>
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
                <p>
                    <label>
                        <p>Text Editor</p>
                        <Tiptap
                            key="plot-tiptap"
                            content={story.plot}
                        />
                    </label>
                </p>
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