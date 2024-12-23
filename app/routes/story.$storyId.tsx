import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { createCharacter, StoryResponse } from "~/data";
import { useLoaderData, useMatches, Link, useActionData } from "@remix-run/react";
import { getStory } from "~/data";
import { user } from "~/data";
import ReverieNav from "~/components/ReverieNav";
import { Form } from "@remix-run/react";

export async function loader({
    params,
    request,
}: LoaderFunctionArgs){
    const storyId = params.storyId;
    invariant(storyId, 'Missing storyId');

    const story: StoryResponse = await getStory(request, Number(storyId));

    if(!story){
        throw new Response("Not Found", { status: 404 });
    }

    console.log(story);

    return json({ story, user })
}

export async function action({
    params,
    request,
}: ActionFunctionArgs){
    const storyId = params.storyId;
    invariant(storyId, 'Missing storyId');

    const formData = await request.formData();
    console.log(Object.fromEntries(formData));

    const characterData = {
        name: String(formData.get('name')),
        description: String(formData.get('description')),
    }

    const characterResponse = await createCharacter(request, Number(storyId), characterData);

    const success = {
        message: `Successfully added ${formData.get('name')} to story ${storyId}`;
    };

    return json({ success });
}

export default function Story(){
    const { story } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const matches = useMatches();

    return (
        <div id="contact">
            <ReverieNav user={user} />
            <Link to="/home">Go Back to Home</Link>
            <h1>{story.title}</h1>
            <h2>{story.subtitle}</h2>
            <h3>{story.summary}</h3>
            <h6>Written by: {story.owner}</h6>
            <p>{story.plot}</p>
            <h5>
                Characters: 
                {story.characters && story.characters.length ? 
                    story.characters.map((character)=>{
                        return (
                            <p>{character.name}</p>
                        )
                    })
                : <span> <em>No characters yet</em></span>}
            </h5>
            <Link to={`/story/${story.id}/edit`}>Edit Story</Link>
            <Form method="post">
                    <label>
                        <p>Name</p>
                        <input
                            name="name"
                            placeholder="Name your character"
                            type="text"
                        />
                    </label>
                    <label>
                        <p>Description</p>
                        <input
                            name="description"
                            placeholder="Describe your character"
                            type="text"
                        />
                    </label>
                    <button
                        type="submit"
                        name="action"
                        value="character"
                    >
                        Add Character to Story
                    </button>
            </Form>
        </div>
    );
}