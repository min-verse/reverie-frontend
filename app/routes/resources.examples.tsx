import { json, LoaderFunctionArgs } from '@remix-run/node'
import { requireUserSession } from '~/services/session.server'

export async function loader({request}: LoaderFunctionArgs) {
  await requireUserSession(request)
  return json({ route: 'SUCCESS: this is the examples route' })
}