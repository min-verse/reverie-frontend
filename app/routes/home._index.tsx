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
  return null;
}

export default function HomeIndex() {
  return (
    <div className="parent-container" style={{display: 'flex', flexDirection: 'row'}}>
      <h1>No Story Selected Yet</h1>
    </div>
  );
}
