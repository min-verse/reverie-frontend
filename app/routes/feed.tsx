import { json, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, NavLink, useLoaderData, useMatches } from "@remix-run/react";
import { getStories, StoryResponse } from "~/data";
import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import { user, getFeed } from "~/data";
import ReverieNav from "~/components/ReverieNav";
import { requireUserSession } from "~/services/session.server";

export const loader = async({
  request,
}: LoaderFunctionArgs ) => {
  const stories: Array<StoryResponse> = await getFeed(request);
  console.log(`here are the stories the feed route loader: ${stories}`)
  // const stories = null;
  return json({ stories, user });
}

export default function Feed() {
  const { stories } = useLoaderData<typeof loader>();

  return (
    <>
        <ReverieNav user={user} />
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
