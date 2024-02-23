import { json, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, NavLink, useLoaderData, useMatches } from "@remix-run/react";
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

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();
  const matches = useMatches();

  return (
    <div className="parent-container" style={{display: 'flex', flexDirection: 'row'}}>
      <h1>This is the root route's index page</h1>
      <Link to='/home'>Go to the Home Page</Link>
    </div>
  );
}
