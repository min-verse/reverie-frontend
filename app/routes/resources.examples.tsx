import { json } from '@remix-run/node'

export async function loader() {
  return json({ route: 'SUCCESS: this is the examples route' })
}