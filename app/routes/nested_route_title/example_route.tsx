import { json } from '@remix-run/node'

export async function loader() {
  return json({ success: 'Successfully configured a nested route manually in remix.config.js' })
}