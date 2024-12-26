import { LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getFeedStory, StoryResponse, retrieveUserDetails, UserProfile } from "~/data";
import { useLoaderData, Link } from "@remix-run/react";
import NewNewReverieNav from "~/components/NewNewReverieNav";
import { requireUserSession } from "~/services/session.server";

export async function loader({
    params,
    request,
}: LoaderFunctionArgs){
    const storyId = params.storyId;
    invariant(storyId, 'Missing storyId');
    const session = await requireUserSession(request);

    const story: StoryResponse = await getFeedStory(request, Number(storyId));

    if(!story){
        throw new Response("Not Found", { status: 404 });
    }

    const userProfile: UserProfile = await retrieveUserDetails(session);

    console.log(story);

    return json({ story, userProfile })
}

export default function Story(){
    const { story, userProfile } = useLoaderData<typeof loader>();

    return (
        <div id="contact">
            <NewNewReverieNav userProfile={userProfile} />
            <Link to="/feed">Go Back to Feed</Link>
            <h1>{story.title}</h1>
            <h2>{story.subtitle}</h2>
            <h3>{story.summary}</h3>
            <h6>Written by: {story.author}</h6>
            <p>{story.plot}</p>
            <h5>
                Characters: 
                {story.characters && story.characters.length ? 
                    story.characters.map((character)=>{
                        return (
                            <p
                                key={character.id}
                            >
                                {character.name}
                            </p>
                        )
                    })
                : <span> <em>No characters yet</em></span>}
            </h5>
        </div>
    );
}