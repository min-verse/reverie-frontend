import { User } from "~/data";
import { Form, Link } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { ActionFunctionArgs } from "@remix-run/node";
import { getSession, commitSession } from "~/services/session.server";

interface ReverieNavProps {
    user: User
}

export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  session.unset("credentials");

  // TODO: Update this to destroySession
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
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
              />
              {user.username}
            </Link>
            <Form method="post">
              <button type="submit" value="logout">
                Logout
              </button>
            </Form>
        </header>
    )
}