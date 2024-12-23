import { json, type MetaFunction, type LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Link, NavLink, useLoaderData, useMatches, useNavigate } from "@remix-run/react";
import { getStories } from "~/data";
import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import { user } from "~/data";
import ReverieNav from "~/components/ReverieNav";
import { requireUserSession } from "~/services/session.server";
import { Form } from "@remix-run/react";
import Tiptap from "~/components/Tiptap";


export const loader = async({
  request,
}: LoaderFunctionArgs ) => {
  await requireUserSession(request);
  const stories = await getStories();

  // const stories = null;
  return json({ stories, user });
}

export const action = async({
    request,
  }: ActionFunctionArgs ) => {
    const session = await requireUserSession(request);

    const formData = await request.formData();
    console.log(Object.fromEntries(formData));
  
    // const stories = null;
    return json({ user });
  }

export default function WriteStory() {
    const navigate = useNavigate();

  return (
    <>
        <ReverieNav user={user} />
        <Form method="post">
                <label>
                    <span>Title</span>
                    <input
                    name="title"
                    placeholder="Title your story"
                    type="text"
                    />
                </label>
                <label>
                    <span>Subtitle</span>
                    <input
                    name="subtitle"
                    placeholder="Elaborate on the title"
                    type="text"
                    />
                </label>
                <label>
                    <span>Summary</span>
                    <input
                    name="summary"
                    placeholder="Summarize your story here"
                    type="text"
                    />
                </label>
                <label>
                    <span>Plot</span>
                    <textarea
                        name="plot"
                        placeholder="Explain your plot here"
                        rows={4}
                        cols={40}
                        />
                    
                </label>
                <p>
                    <label>
                        <p>Text Editor</p>
                        <Tiptap
                            key="plot-tiptap"
                            content = {""}
                        />
                    </label>
                </p>
                <label>
                    <span>Medium</span>
                    <select name="medium">
                        <option disabled>--Please Select a Medium--</option>
                        <option value="gn">Graphic Novel</option>
                        <option value="bk">Book</option>
                        <option value="sh">Short Story</option>
                        <option value="nv">Novel</option>
                        <option value="na">Novella</option>
                        <option value="cc">Comic</option>
                        <option value="mn">Manga</option>
                        <option value="sh">TV Show</option>
                        <option value="ot">Other</option>
                    </select>
                </label>
                <label>
                    <span>Privacy</span>
                    <select name="privacy">
                        <option disabled>--Please Select a Privacy Status--</option>
                        <option value="pub">Public</option>
                        <option value="pri">Private</option>
                    </select>
                </label>
                <button type="submit">Create Story</button>
                <button type="button" onClick={() => navigate(`/home`)}>Cancel Story</button>
            </Form>
    </>
  );
}
