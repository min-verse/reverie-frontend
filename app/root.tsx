import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { setCsrfToken } from "./data";
import { commitSession, getSession } from "./services/session.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const session = await getSession(
    request.headers.get('Cookie')
  );

  if(session){
    console.log(`Found a session: ${session}`);
    for(const key in session){
      console.log(`Session key ${key}`);
    }
    console.log(`Representing this as a string: ${JSON.stringify(session)}`);
  }

  if(session.get('csrftoken')){
    console.log(`Got the csrftoken and it is ${session.get('csrftoken')}`);
  }

  const data = { error: session.get('error') }

  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session),
    }
  });
}

// export function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         {children}
//         <ScrollRestoration />
//         <Scripts />
//         <LiveReload />
//       </body>
//     </html>
//   );
// }

export default function App() {
  return(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <>
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
          <Link
            to={`/login`}
            style={{
              backgroundColor:'aquamarine'
            }}
          >
            Click here to login
          </Link>
          <Outlet />
        </>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
