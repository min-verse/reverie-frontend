import setCookie from 'set-cookie-parser';
import { getSession, requireUserSession } from "./services/session.server";
import { SessionData } from '@remix-run/node';

export interface Story {
    id: number,
    title: string,
    subtitle: string,
    plot: string,
    summary: string,
    privacy: string,
    medium: string,
    other_medium: string,
    owner: string
}

export interface StoryResponse {
    readonly id: number,
    title: string,
    subtitle: string,
    plot: string,
    summary: string,
    privacy: string,
    medium: string,
    other_medium: string,
    owner: string,
    author: string,
    characters?: Array<Character>
}

export interface StoryParams {
    title: string | null,
    subtitle: string | null,
    plot: string | null,
    summary: string | null,
    privacy: string | null,
    medium: string | null,
    other_medium: string | null,
}

export interface StoryUpdateParams {
    title?: string | null,
    subtitle?: string | null,
    plot?: string | null,
    summary?: string | null,
    privacy?: string | null,
    medium?: string | null,
    other_medium?: string | null,
}

export interface Character {
    id: number,
    storyId: number,
    name: string,
}

export interface CharacterParams {
    name: string | null,
    description: string | null,
}

export interface Error {
    error: string,
}

export interface User {
    id: number,
    email: string,
    username: string,
    avatar_url: string,
    password: string
}

export interface UserProfile {
    username: string,
    avatar_url: string | null,
}

export interface RegisterParams {
    username: string,
    email: string,
    firstName?: string,
    lastName?: string,
    avatarUrl?: string,
    password: string,
    confirmPassword: string
}

export const user: User = {
    id: 1,
    email: "johndoe@aol.com",
    username: "xX__blaze__Xx",
    avatar_url: "https://avatarfiles.alphacoders.com/240/240756.png",
    password: "123"
}

export const userProfile: UserProfile = {
    username: "xX__blaze__Xx",
    avatar_url: "https://avatarfiles.alphacoders.com/240/240756.png"
}

export async function getStory(request: Request, query?: number | null){
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
}

export async function getFeedStory(request: Request, query?: number | null){
    const session = await requireUserSession(request);

    const storyResponse = await fetch(`http://localhost:8000/dream/story_feed_detail/${query}`, {
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
}

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

export async function getUserProfile(request: Request){
    const session = await requireUserSession(request);

    const profileResponse = await fetch(`http://localhost:8000/profile/`, {
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
            console.log(`ERROR RETRIEVING USER PROFILE with status: ${res.status}`)
        }else{
            return res.json();
        }
    }).then((data)=>{
        return data;
    });

    return profileResponse;
}

export async function updateUserProfile(request: Request, new_avatar_url: string){
    const session = await requireUserSession(request);

    const profileResponse = await fetch(`http://localhost:8000/profile/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: Object.entries(session.data)
                  .map(([key, value]) => `${key}=${value}`)
                  .join('; '),
            'X-CSRFToken': session.get('csrftoken')
        },
        body: JSON.stringify({
            avatar_url: new_avatar_url
        })
    }).then((res)=>{
        if(!res.ok){
            throw new Error(`ERROR UPDATING USER PROFILE with status: ${res.status}`)
        }else{
            return res.json();
        }
    }).then((data)=>{
        return data;
    }).catch((e)=>{
        return { error: e.message };
    });

    return profileResponse;
}

export async function retrieveUserDetails(session: SessionData): Promise<UserProfile>{
    return {
        username: session.get('username'),
        avatar_url: session.get('avatar_url')
    }
}

// export async function getCharacters(query?: Number | null){
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     const story = stories.find((story)=> story.id === query);
//     if(!story){
//         throw new Response("Not Found", { status: 404 });
//     }
//     return characters.filter((character)=> character.storyId === story.id);
// };

export async function getCharacters(request: Request, query?: number | null){
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
}

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

export async function updateStory(request: Request, storyId: number, storyData: StoryUpdateParams){
    const session = await requireUserSession(request);

    const response = await fetch(`http://localhost:8000/dream/all_stories/${storyId}`, {
        method: 'PUT',
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
            throw new Error(`Error in updating story ${storyId} with status: ${res.status}`)
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

export async function createCharacter(request: Request, storyId: number, characterData: CharacterParams){
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

// export async function authenticate(session: String){
//     const response = await fetch('http://localhost:8000/api_auth/session/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });

//     return response;
// }

export async function login(username: string, password: string){
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
}

export async function register(registerPayload: RegisterParams){
    // const csrfToken = await getCsrfToken(request);
    // console.log(`Reached here 1.2: ${csrfToken}`);

    const response: Response | Error = await fetch(`http://localhost:8000/api_auth/register/`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(registerPayload)
    }).catch((e)=> {
        return {
            error: `Failed to login due to: ${e.message}`
        }
    });

    return response;
}

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

// function getCookie(name: string) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             // Does this cookie string begin with the name we want?
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }