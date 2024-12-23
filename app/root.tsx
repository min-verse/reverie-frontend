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
  redirect,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { getCurrentUser, retrieveCsrfToken } from "./data";
import { commitSession, getSession } from "./services/session.server";
import { useState } from "react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs){
  const session = await getSession(
    request.headers.get('Cookie')
  );

  if(!session.get('csrftoken')){
    const token = await retrieveCsrfToken();
    session.set('csrftoken', token);
  }

  const data = { error: session.get('error') }

  console.log(`This is the session's id: ${session.get('sessionid')}`);
  console.log(`This is the csrftoken: ${session.get('csrftoken')}`);

  return json({ data }, {
    headers: {
      "Set-Cookie": await commitSession(session),
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
          <Outlet />
        </>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
