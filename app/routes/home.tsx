import { json, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, NavLink, useLoaderData, Outlet } from "@remix-run/react";
import { getStories, StoryResponse } from "~/data";
import { useEffect, useState } from "react";
import ReverieNav from "~/components/ReverieNav";

export const meta: MetaFunction = () => {
  return [
    { title: "Reverie Frontend" },
    { name: "description", content: "Welcome to Reverie!" },
  ];
};

export const loader = async({
  request,
}: LoaderFunctionArgs ) => {
  const stories: Array<StoryResponse> = await getStories(request);
  // const userProfile = await getUserProfile(request);
  console.log(`here are the stories the home route loader: ${stories}`)
  // const stories = null;
  return json({ stories });
}

export default function HomeIndex() {
  const { stories } = useLoaderData<typeof loader>();
  const [ searchField, setSearchField ] = useState('');
  const [ allStories, setStories ] = useState(stories);

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.toLocaleLowerCase();
    setSearchField(value);
  };

  useEffect(()=>{
    setStories(
      stories.filter((story)=>{
        return story.title.toLocaleLowerCase().includes(searchField)
      })
    );
  },[stories, searchField]);

  return (
    <>
        <ReverieNav />
        <Link
          to={'/write_story'}>
            Write a New Story
        </Link>
        <div className="parent-container" style={{display: 'flex', flexDirection: 'row'}}>
        <div className="smaller-child-column">
            <input 
                type="text" 
                placeholder="Search Story by Title"
                onChange={handleSearch}
            />
            {allStories && allStories.length ? allStories.map((story)=>{
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
            }) : <p>No stories started yet</p>}
        </div>
        <div id="detail" className="smaller-child-column" style={{backgroundColor: 'lightblue'}}>
            <p>Story Listed Here</p>
            <Outlet />
        </div>
        </div>
    </>
  );
}
