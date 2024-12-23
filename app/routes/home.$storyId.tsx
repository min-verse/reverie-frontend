import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { Link, useLoaderData, useMatches } from "@remix-run/react";
import { getStory } from "~/data";

export async function loader({
    params,
    request,
}: LoaderFunctionArgs){
    const storyId = params.storyId;
    invariant(storyId, 'Missing storyId');

    const story = await getStory(request, Number(storyId));

    if(!story){
        throw new Response("Not Found", { status: 404 });
    }

    return json({ story })
}

export default function Story(){
    const { story } = useLoaderData<typeof loader>();
    const matches = useMatches();

    return (
        <div id="contact">
            <h1>{story.title}</h1>
            <h2>{story.subtitle}</h2>
            <h3>{story.summary}</h3>
            <h6>Written by: {story.owner}</h6>
            <p>{story.plot}</p>
            <Link to={`/story/${story.id}`}>Go to {story.title} Page</Link>
        </div>
    );
}