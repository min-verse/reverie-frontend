import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { useLoaderData } from "@remix-run/react";
import { getStory } from "~/data";

export async function loader({
    params,
    request,
}: LoaderFunctionArgs){
    const storyId = params.storyId;
    const story = await getStory(Number(storyId));

    return json({ story })
}

export default function Story(){
    const { story } = useLoaderData<typeof loader>();

    return (
        <div>
            <h1>{story.title}</h1>
            <h2>{story.subtitle}</h2>
            <h3>{story.summary}</h3>
            <h6>Written by: {story.owner}</h6>
            <p>{story.plot}</p>
        </div>
    );
}