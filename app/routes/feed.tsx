import { json, SessionData, type LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { getFeed, retrieveUserDetails, StoryResponse, UserProfile } from "~/data";
import NewNewReverieNav from "~/components/NewNewReverieNav";
import { requireUserSession } from "~/services/session.server";

export const loader = async({
  request,
}: LoaderFunctionArgs ) => {
  const session: SessionData = await requireUserSession(request);
  const stories: Array<StoryResponse> = await getFeed(request);
  // const userProfile = await getUserProfile(request);
  console.log(`here are the stories the feed route loader: ${stories}`)
  const userProfile: UserProfile = await retrieveUserDetails(session);
  // const stories = null;
  return json({ stories, userProfile });
}

export default function Feed() {
  const { stories, userProfile } = useLoaderData<typeof loader>();

  return (
    <>
        <NewNewReverieNav userProfile={userProfile} />
        {stories && stories.length ? stories.map((story)=>{
            return (
                <ul key={story.id}>
                <NavLink 
                  to={`/home/${story.id}`}
                  className={({isActive})=>
                    isActive ? 'bg-green-500 font-bold' : 'bg-blue-200 font-thin'
                  }
                  >
                    Go to <em>{story.title}</em> Page
                </NavLink>
                <h2>Title: {story.title}</h2>
                <h3>Author: {story.author}</h3>
                <p>Summary: {story.summary}</p>
                </ul>
            )
            }) : <p>No public stories yet</p>}
    </>
  );
}
