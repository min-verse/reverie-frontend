import { json, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { login } from "~/data";
import { Form } from "@remix-run/react";

export const loader = async({
    request,
}: LoaderFunctionArgs)=>{

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

    const response = await login(username, password);
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
                        type="text"
                    />
                </label>
                <button type="submit">Login</button>
            </Form>
        </>
    );
}