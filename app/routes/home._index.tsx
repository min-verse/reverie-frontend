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
  const stories = await getStories(request);

  // const stories = null;
  return json({ stories });
}

export default function HomeIndex() {
  const { stories } = useLoaderData<typeof loader>();
  const matches = useMatches();

  return (
    <div className="parent-container" style={{display: 'flex', flexDirection: 'row'}}>
      <h1>No Story Selected Yet</h1>
    </div>
  );
}
