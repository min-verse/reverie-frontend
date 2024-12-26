import { json, SessionData, type LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getFeed, retrieveUserDetails, StoryResponse, UserProfile } from "~/data";
import NewNewReverieNav from "~/components/NewNewReverieNav";
import { requireUserSession } from "~/services/session.server";
import { useEffect, useState } from "react";

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
        <NewNewReverieNav userProfile={userProfile} />
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
                  to={`/feed/${story.id}`}
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
