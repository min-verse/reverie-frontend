import { ActionFunctionArgs, Cookie, LoaderFunctionArgs, isCookie } from "@remix-run/node";
import setCookie from 'set-cookie-parser';
import { getSession, requireUserSession } from "./services/session.server";

export interface Story {
    id: Number,
    title: String,
    subtitle: String,
    plot: String,
    summary: String,
    privacy: String,
    medium: String,
    other_medium: String,
    owner: String
};

export interface StoryResponse {
    readonly id: Number,
    title: String,
    subtitle: String,
    plot: String,
    summary: String,
    privacy: String,
    medium: String,
    other_medium: String,
    owner: String,
    author: String,
    characters?: Array<Character>
};

export interface StoryParams {
    title: String | null,
    subtitle: String | null,
    plot: String | null,
    summary: String | null,
    privacy: String | null,
    medium: String | null,
    other_medium: String | null,
};

export interface Character {
    id: Number,
    storyId: Number,
    name: String,
};

export interface CharacterParams {
    name: String | null,
    description: String | null,
};

export interface Error {
    error: String,
}

export interface User {
    id: Number,
    email: String,
    username: String,
    picUrl: String,
    password: String
}

export const user: User = {
    id: 1,
    email: "johndoe@aol.com",
    username: "xX__blaze__Xx",
    picUrl: "https://avatarfiles.alphacoders.com/240/240756.png",
    password: "123"
}

export async function getStory(request: Request, query?: Number | null){
    const session = await requireUserSession(request);

    const storyResponse = await fetch(`http://localhost:8000/dream/all_stories/${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: Object.entries(session.data)
                  .map(([key, value]) => `${key}=${value}`)
                  .join('; '),
            'X-CSRFToken': session.get('csrftoken')
        }
    }).then((res)=>{
        if(!res.ok){
            console.log(`ERROR CREATING STORY with status: ${res.status}`)
        }else{
            return res.json();
        }
    }).then((data)=>{
        return data;
    });

    if(!storyResponse){
        throw new Response("Not Found", { status: 404 });
    }

    return { ...storyResponse }
};

export async function getFeed(request: Request){
    const session = await requireUserSession(request);

    const storiesResponse = await fetch('http://localhost:8000/dream/stories_feed/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: Object.entries(session.data)
                  .map(([key, value]) => `${key}=${value}`)
                  .join('; '),
            'X-CSRFToken': session.get('csrftoken')
        }
    }).then((res)=>{
        if(!res.ok){
            console.log(`ERROR RETRIEVING FEED with status: ${res.status}`)
        }else{
            return res.json();
        }
    }).then((data)=>{
        return data;
    });

    return storiesResponse;
}

export async function getStories(request: Request){
    const session = await requireUserSession(request);

    const storiesResponse = await fetch('http://localhost:8000/dream/all_stories/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: Object.entries(session.data)
                  .map(([key, value]) => `${key}=${value}`)
                  .join('; '),
            'X-CSRFToken': session.get('csrftoken')
        }
    }).then((res)=>{
        if(!res.ok){
            console.log(`ERROR RETRIEVING USER'S STORIES with status: ${res.status}`)
        }else{
            return res.json();
        }
    }).then((data)=>{
        return data;
    });

    return storiesResponse;
}

// export async function getCharacters(query?: Number | null){
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     const story = stories.find((story)=> story.id === query);
//     if(!story){
//         throw new Response("Not Found", { status: 404 });
//     }
//     return characters.filter((character)=> character.storyId === story.id);
// };

export async function getCharacters(request: Request, query?: Number | null){
    const session = await requireUserSession(request);

    const charactersResponse = await fetch(`http://localhost:8000/dream/characters/${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: Object.entries(session.data)
                  .map(([key, value]) => `${key}=${value}`)
                  .join('; '),
            'X-CSRFToken': session.get('csrftoken')
        }
    }).then((res)=>{
        if(!res.ok){
            console.log(`ERROR RETRIEVE CHARACTERS with status: ${res.status}`)
        }else{
            return res.json();
        }
    }).then((data)=>{
        return data;
    });

    return charactersResponse;
};

export async function createStory(request: Request, storyData: StoryParams){
    const session = await requireUserSession(request);

    const response = await fetch('http://localhost:8000/dream/all_stories/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: Object.entries(session.data)
                  .map(([key, value]) => `${key}=${value}`)
                  .join('; '),
            'X-CSRFToken': session.get('csrftoken')
        },
        body: JSON.stringify(storyData)
    }).then((res)=>{
        if(!res.ok){
            throw new Error(`Error in creating story ${storyData['title']} with status: ${res.status}`)
        }else{
            return res.json();
        }
    }).then((data)=>{
        return data;
    }).catch((e)=>{
        return {
            error: e.message
        }
    });

    return response;
}

export async function createCharacter(request: Request, storyId: Number, characterData: CharacterParams){
    const session = await requireUserSession(request);

    const characterResponse = await fetch(`http://localhost:8000/dream/characters/${storyId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: Object.entries(session.data)
                  .map(([key, value]) => `${key}=${value}`)
                  .join('; '),
            'X-CSRFToken': session.get('csrftoken')
        },
        body: JSON.stringify(characterData)
    }).then((res)=>{
        if(!res.ok){
            console.log(`ERROR CREATING CHARACTER with status: ${res.status}`)
        }else{
            return res.json();
        }
    }).then((data)=>{
        return data;
    });

    return characterResponse;
}

export async function authenticate(session: String){
    const response = await fetch('http://localhost:8000/api_auth/session/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response;
};

export async function login(username: String, password: String, request: Request){
    // const csrfToken = await getCsrfToken(request);
    // console.log(`Reached here 1.2: ${csrfToken}`);

    const response: Response | Error = await fetch('http://localhost:8000/api_auth/login/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).catch((e)=> {
        return {
            error: `Failed to login due to: ${e.message}`
        }
    });

    return response;
};

export async function register(username: String, email: String, password: String, request: Request){
    // const csrfToken = await getCsrfToken(request);
    // console.log(`Reached here 1.2: ${csrfToken}`);

    const response: Response | Error = await fetch(`http://localhost:8000/api_auth/register/`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    }).catch((e)=> {
        return {
            error: `Failed to login due to: ${e.message}`
        }
    });

    return response;
};

export async function logout(request: Request){
    const session = await requireUserSession(request);

    const response = await fetch('http://localhost:8000/api_auth/logout/',{
        method: 'DELETE',
        headers: {
            Cookie: Object.entries(session.data)
                  .map(([key, value]) => `${key}=${value}`)
                  .join('; '),
            'X-CSRFToken': session.get('csrftoken')
            }
    }).then((res)=>{
        if(!res.ok){
            console.log(`ERROR: The status is ${res.status}`);
        }else{
            return res.json();
        }
    }).then((data)=>{
        return data;
    });

    console.log(`This is the response: ${response} which is ${typeof response}`);

    return response;
}

export async function retrieveCsrfToken(){
    const token = await fetch('http://localhost:8000/api_auth/set_csrf')

    // SET THE CSRFTOKEN

    const setCookieHeader = token.headers.get('Set-Cookie');

    if(!setCookieHeader){
        throw new Error('No session or cookie found for Set-Cookie, unable to authenticate');
    }

    const response = setCookie.parse(setCookieHeader);
    const tokenItem = response.find((item)=> item['name']=='csrftoken');

    if(!tokenItem){
        throw new Error('No csrftoken was found on the response');
    }

    return tokenItem['value'];
}

export async function getCsrfToken(request: Request){
    const session = await getSession(
        request.headers.get('Cookie')
    );

    const token = session.get('csrftoken');

    if(!token){
        throw new Error('No csrftoken was found in the current session');
    }

    console.log(`The getCsrfToken token here: ${token}`)

    return token;
}

export async function getCurrentUser(request: Request){
    const session = await getSession(
        request.headers.get('Cookie')
      );

    const userResponse = await fetch('http://localhost:8000/api_auth/whoami/'
        ,{
            headers: {
              Cookie: Object.entries(session.data)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('; '),
              }
          })
      .then((res)=>res.json())
      .then((data)=>data)
      .catch((err)=>err.message);
    console.log(userResponse);
    return userResponse['username'];
}

function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}