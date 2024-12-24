import { User } from "~/data";
import { Form, Link } from "@remix-run/react";
import { redirect, ActionFunctionArgs } from "@remix-run/node";
import { getSession, destroySession } from "~/services/session.server";

interface ReverieNavProps {
    user: User
}

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("Reached the beginning of the action method");
  const session = await getSession(
    request.headers.get("Cookie")
  );
  console.log("Reached this part of the logout action");
  // TODO: Update this to destroySession
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function ReverieNav({ user }: ReverieNavProps){
    return(
        <header style={{backgroundColor: 'yellow', display:'flex',justifyContent:'space-between'}}>
            <h1>
              <Link to="/home">
                Navigation Bar
              </Link>
            </h1>
            <Link 
              to="/profile"
              style={{float:'right'}}
              >
              <img
                style={{borderRadius:50}}
                width={100}
                height={100}
                src={`https://avatarfiles.alphacoders.com/240/240756.png`}
                alt={`Avatar for ${user.username}`}
              />
              {user.username}
            </Link>
            <Link
              to={'/feed'}
            >
              Return to Stories Feed
            </Link>
            <Link
              to={'/'}
            >
              Return to Index Route
            </Link>
            <Form method="post" action="/logout">
              <button type="submit" value="logout">
                Logout
              </button>
            </Form>
        </header>
    )
}