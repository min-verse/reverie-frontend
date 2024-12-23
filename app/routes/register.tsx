import { json, 
    ActionFunctionArgs, 
    LoaderFunctionArgs, 
    CookieParseOptions, 
    CookieSerializeOptions, 
    redirect} from "@remix-run/node";
import { register } from "~/data";
import { Form } from "@remix-run/react";
import setCookie from "set-cookie-parser";
import { commitSession, getSession } from "~/services/session.server";
import { useActionData } from "@remix-run/react";
import { useState } from "react";

export const loader = async({
    request,
}: LoaderFunctionArgs)=>{
    const session = await getSession(
        request.headers.get('Cookie')
    );

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
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const confirmPassword = String(formData.get('confirmPassword'));

    const errors: any = {}
    if(!username){
        errors.username = "Invalid register attempt - Username required";
    }

    if(!email){
        errors.email = "Invalid register attempt - Email required";
    }else if(!email.includes("@")){
        errors.email = "Invalid email address format"
    }

    if(!password){
        errors.password = "Invalid register attempt - Password required";
    }

    if(password !== confirmPassword){
        errors.confirmPassword = "Invalid register attempt - Passwords do not match";
    }

    if(Object.keys(errors).length > 0){
        return json({ errors });
    }

    const response = await register(username, email, password, request);
    if('error' in response){
        return json({ response })
    }

    if(!response || !response.ok){
        console.log('Bad response received, not authenticated');
        return redirect('/unauthenticated');
    }

    const session = await getSession(request.headers.get('Cookie'));

    session.flash("registerSuccess", `Successfully registered ${username}, please log in`);

    return redirect('/login', { 
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    });
};

export default function Register(){
    const actionData = useActionData<typeof action>();
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    return(
        <>
            {
                actionData && 'response' in actionData ?
                    <p><span style={{color:'red'}}>{actionData?.response?.error}</span></p>
                :
                null
            }

            <Form method="post">
                <label>
                    <span>Username</span>
                    <input
                        name="username"
                        placeholder="Username"
                        type="text"
                    />
                    {
                        actionData && 'errors' in actionData && actionData?.errors?.username ?
                        <p><span style={{color:'red'}}>{actionData?.errors?.username}</span></p>
                        :
                        null
                    }
                </label>
                <label>
                    <span>Email</span>
                    <input
                        name="email"
                        placeholder="Email"
                        type="text"
                    />
                    {
                        actionData && 'errors' in actionData && actionData?.errors?.email ?
                        <p><span style={{color:'red'}}>{actionData?.errors?.email}</span></p>
                        :
                        null
                    }
                </label>
                <label>
                    <span>Password</span>
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {
                        actionData && 'errors' in actionData && actionData?.errors?.password ?
                        <p><span style={{color:'red'}}>{actionData?.errors?.password}</span></p>
                        :
                        null
                    }
                </label>
                <label>
                    <span>Confirm Password</span>
                    <input
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                    {
                        actionData && 'errors' in actionData && actionData?.errors?.confirmPassword ?
                        <p><span style={{color:'red'}}>{actionData?.errors?.confirmPassword}</span></p>
                        :
                        null
                    }
                </label>
                <button type="submit">Register</button>
            </Form>
            {
                password && confirmPassword && password !== confirmPassword ?
                    <p><span style={{color:'red'}}>Passwords do not match</span></p>
                :
                null
            }
        </>
    );
}