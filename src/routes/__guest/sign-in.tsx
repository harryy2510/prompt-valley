import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__guest/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/__guest/sign-in"!</div>
}
