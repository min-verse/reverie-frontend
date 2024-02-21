import { json, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Reverie Frontend" },
    { name: "description", content: "Welcome to Reverie!" },
  ];
};

export const loader = async({
  request,
}: LoaderFunctionArgs ) => {
  const stories = [{
    title: "The Giving Tree",
    author: "Shel Silverstein"
  }, {
    title: "Journey to the West",
    author: "Wu Cheng'en"
  }];

  // const stories = null;
  return json({ stories });
}

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();

  return (
    <div className="parent-container">
      <div className="smaller-child-column">
        {stories && stories.length ? stories.map((story)=>{
          return (
            <ul>
              <h2>Title: {story.title}</h2>
              <h3>Author: {story.author}</h3>
            </ul>
          )
        }) : <p>No stories started yet</p>}
      </div>
      <div className="smaller-child-column">

      </div>
    </div>
  );
}
