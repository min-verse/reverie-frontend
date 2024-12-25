import { json, LoaderFunctionArgs } from '@remix-run/node'
import { getUserProfile } from '~/data';

export async function loader({request}: LoaderFunctionArgs) {
  const userProfile = await getUserProfile(request);
  return json({ userProfile })
}