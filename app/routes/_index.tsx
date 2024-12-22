import { json, type ActionFunctionArgs, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, NavLink, useLoaderData, useMatches, redirect, useActionData } from "@remix-run/react";
import { getStories, getCurrentUser, retrieveCsrfToken } from "~/data";
import { commitSession, getSession } from "~/services/session.server";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Reverie Frontend" },
    { name: "description", content: "Welcome to Reverie!" },
  ];
};

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const session = await getSession(
    request.headers.get('Cookie')
  );

  // if(!session.get('csrftoken')){
  //   const token = await retrieveCsrfToken();
  //   session.set('csrftoken', token);
  // }

  const authenticated = session.get('sessionid') ? { message: `You're authenticated!` } : null;
  console.log(`This is the authenciated in root: ${authenticated}`)
  if(!authenticated){
    console.log('reached login redirect')
    throw redirect('/login');
  }

  // TODO: Set username here and see if it works
  const data = { error: session.get('error') }

  return json({ data, authenticated }, {
    headers: {
      'Set-Cookie': await commitSession(session),
    }
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const actionResponse: {
    username?: string | null;
    email?: string | null;
    errors?: string | null;
  } = {};

  const formData = await request.formData();
  const action = formData.get("action");

  switch(action){
    case 'username':
      const username = await getCurrentUser(request);
      actionResponse['username'] = username;
      break;
    case 'email':
      actionResponse['email'] = 'jeremy.willis@teufort.gov'
      break;
    default:
      actionResponse['errors'] = 'Invalid action'
      break;
  }

  return json({ actionResponse });
}

export default function Index() {
  const { data, authenticated } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="parent-container" style={{display: 'flex', flexDirection: 'row'}}>
      <h1>This is the root route's index page</h1>
      <Link to='/home'>Go to the Home Page</Link>
      <h1 className="text-3xl font-bold underline">
            Reverie
          </h1>
          {authenticated && authenticated.message ?
              <Link
              to={`/home`}
              style={{
                backgroundColor:'aquamarine'
              }}
            >
              Go to Reverie Home
            </Link>
          :
            <Link
              to={`/login`}
              style={{
                backgroundColor:'aquamarine'
              }}
            >
              Click here to login
            </Link>
          }
          {authenticated && authenticated.message ? 
            <p style={{backgroundColor: 'lightgreen'}}>{authenticated.message}</p>
          : 
            <p style={{backgroundColor: 'red'}}>Nobody is authenticated!</p>
          }
          <Form method="post">
            <button
              type="submit"
              style={{backgroundColor:'lavender'}}
              name="action"
              value="username"
            >
              Click here for Username
            </button>
          </Form>
          <Form method="post">
            <button
              type="submit"
              style={{backgroundColor:'lavender'}}
              name="action"
              value="email"
            >
              Click here for Email
            </button>
          </Form>
          {actionData?.actionResponse?.username ?
            <p style={{backgroundColor: 'powderblue'}}>{actionData?.actionResponse?.username}</p>
           : 
           null}
           {actionData?.actionResponse?.email ?
            <p style={{backgroundColor: 'cornflowerblue'}}>{actionData?.actionResponse?.email}</p>
           : 
           null}
    </div>
  );
}
