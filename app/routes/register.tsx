import { json, 
    ActionFunctionArgs, 
    LoaderFunctionArgs, 
    redirect} from "@remix-run/node";
import { register, RegisterParams } from "~/data";
import { Form, Link, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "~/services/session.server";
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
    request
}: ActionFunctionArgs)=>{
    const formData = await request.formData();
    const username = String(formData.get('username'));
    const email = String(formData.get('email'));
    const firstName = String(formData.get('firstName'));
    const lastName = String(formData.get('lastName'));
    const avatarUrl = String(formData.get('avatarUrl'));
    const password = String(formData.get('password'));
    const confirmPassword = String(formData.get('confirmPassword'));

    const errors: {
        username?: string,
        email?: string,
        password?: string,
        confirmPassword?: string
    } = {}
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

    const registerPayload: RegisterParams = {
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        avatarUrl: avatarUrl,
        password: password,
        confirmPassword: confirmPassword
    }

    const response = await register(registerPayload);
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
                    <span>First Name</span>
                    <input
                        name="firstName"
                        placeholder="First Name"
                        type="text"
                    />
                </label>
                <label>
                    <span>Last Name</span>
                    <input
                        name="lastName"
                        placeholder="Last Name"
                        type="text"
                    />
                </label>
                <label>
                    <span>Avatar URL</span>
                    <input
                        name="avatarUrl"
                        placeholder="Avatar URL"
                        type="text"
                    />
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
            <Link
                to={`/login`}
            >
                Go back to Login
            </Link>
            {
                password && confirmPassword && password !== confirmPassword ?
                    <p><span style={{color:'red'}}>Passwords do not match</span></p>
                :
                null
            }
        </>
    );
}