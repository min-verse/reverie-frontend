import { json, 
    ActionFunctionArgs, 
    LoaderFunctionArgs, 
    CookieParseOptions, 
    CookieSerializeOptions, 
    redirect} from "@remix-run/node";
import { login } from "~/data";
import { Form } from "@remix-run/react";
import setCookie from "set-cookie-parser";
import { commitSession, getSession } from "~/services/session.server";

export const loader = async({
    request,
}: LoaderFunctionArgs)=>{
    const session = await getSession(
        request.headers.get('Cookie')
      );
    
      // if(!session.get('csrftoken')){
      //   const token = await retrieveCsrfToken();
      //   session.set('csrftoken', token);
      // }
    
    const authenticated = session.get('sessionid') ? { message: `You're authenticated!` } : null;
    if(authenticated){
        console.log(`Session has session id of this on login page: ${session.get('sessionid')}`)
        return redirect('/home');
    }

    return null;
}

export const action = async({
    params,
    request
}: ActionFunctionArgs)=>{
    const formData = await request.formData();
    const username = String(formData.get('username'));
    const password = String(formData.get('password'));

    const errors: any = {}
    if(!username){
        errors.username = "Invalid login attempt - Username required";
    }

    if(!password){
        errors.password = "Invalid login attempt - Password required";
    }

    if(Object.keys(errors).length > 0){
        return json({ errors });
    }

    const response = await login(username, password, request);
    if(response){
        const text = await response.text();
        console.log("Here are the headers");
        console.log(...response.headers);
        console.log(`This is the response status: ${response.status}`);
        console.log(`The Response says this: ${text}`);
    }

    if(!response || !response.ok){
        console.log('Bad response received, not authenticated');
        return redirect('/unauthenticated');
    }

    const setCookieHeader = response.headers.get('Set-Cookie');

    if(!setCookieHeader){
        console.log('No Set-Cookie Header found');
        return redirect('/unauthenticated');
    };

    const parsedResponseCookies = setCookie.parse(setCookie.splitCookiesString(setCookieHeader));
    const sessionIdCookie = parsedResponseCookies.find((cookie) => cookie.name === 'sessionid');

    if(!sessionIdCookie){
        console.log(`No sessionid found in the response's Set-Cookie header`);
        return redirect('/unauthenticated');
    }

    console.log(`sessionIdCookie is: ${JSON.stringify(sessionIdCookie)}`);

    const headers = new Headers();

    const { name, value, ...sessionIdCookieSerializeOptions } = sessionIdCookie;
    const session = await getSession(request.headers.get('Cookie'));

    // NOTE: name is 'sessionid' (supplied by Django), value is an encrypted value (also supplied by Django)
    session.set(name, value);

    headers.append(
        'Set-Cookie',
        await commitSession(
            session,
            sessionIdCookieSerializeOptions as CookieSerializeOptions,
        )
    );

    return redirect('/home', { headers });
};

export default function Login(){
    return(
        <>
            <Form method="post">
            <label>
                    <span>Username</span>
                    <input
                        name="username"
                        placeholder="Username"
                        type="text"
                    />
                </label>
                <label>
                    <span>Password</span>
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                    />
                </label>
                <button type="submit">Login</button>
            </Form>
        </>
    );
}