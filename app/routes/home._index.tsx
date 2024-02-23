import { json, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, useLoaderData, useMatches } from "@remix-run/react";
import { getStories } from "~/data";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Reverie Frontend" },
    { name: "description", content: "Welcome to Reverie!" },
  ];
};

export const loader = async({
  request,
}: LoaderFunctionArgs ) => {
  const stories = await getStories();

  // const stories = null;
  return json({ stories });
}

export default function HomeIndex() {
  const { stories } = useLoaderData<typeof loader>();
  const matches = useMatches();

  return (
    <div className="parent-container" style={{display: 'flex', flexDirection: 'row'}}>
      <div className="smaller-child-column">
        {stories && stories.length ? stories.map((story)=>{
          return (
            <ul key={story.id}>
              <NavLink to={`/stories/${story.id}`}>Go to <em>{story.title}</em> Page</NavLink>
              <h2>Title: {story.title}</h2>
              <h3>Author: {story.owner}</h3>
              <p>Summary: {story.summary}</p>
            </ul>
          )
        }) : <p>No stories started yet</p>}
      </div>
      <div className="smaller-child-column" style={{backgroundColor: 'lightblue'}}>
        <p>Hello</p>
        <Outlet />
      </div>
    </div>
  );
}
