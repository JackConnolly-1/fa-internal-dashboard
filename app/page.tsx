import { redirect } from 'next/navigation'

// Internal GP dashboard. Root sends admins into the portfolio view;
// the Clerk middleware + (internal) layout gate everything to the admin allowlist.
export default function RootPage() {
  redirect('/portfolio')
}
