import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { getFeed, StoryResponse } from "~/data";
import ReverieNav from "~/components/ReverieNav";

export const loader = async({
  request,
}: LoaderFunctionArgs ) => {
  const stories: Array<StoryResponse> = await getFeed(request);
  // const userProfile = await getUserProfile(request);
  console.log(`here are the stories the feed route loader: ${stories}`)
  // const stories = null;
  return json({ stories });
}

export default function Feed() {
  const { stories } = useLoaderData<typeof loader>();

  return (
    <>
        <ReverieNav />
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
