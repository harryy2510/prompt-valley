import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__authed/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/__authed/dashboard"!</div>
}
