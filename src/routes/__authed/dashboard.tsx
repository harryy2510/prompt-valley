import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__authed/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5 dark:to-purple-500/5"></div>
  )
}
