import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      Git Project
      <SignInButton mode="modal">
        <Button variant="outline">Sign In With GitHub</Button>
      </SignInButton>
    </div>
  )
}
