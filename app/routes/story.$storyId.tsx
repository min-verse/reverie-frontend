import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { useLoaderData, useMatches, Link } from "@remix-run/react";
import { getStory } from "~/data";
import { user } from "~/data";
import ReverieNav from "~/components/ReverieNav";

export async function loader({
    params,
    request,
}: LoaderFunctionArgs){
    const storyId = params.storyId;
    invariant(storyId, 'Missing storyId');

    const story = await getStory(Number(storyId));

    if(!story){
        throw new Response("Not Found", { status: 404 });
    }

    console.log(story);

    return json({ story, user })
}

export default function Story(){
    const { story } = useLoaderData<typeof loader>();
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
        </div>
    );
}