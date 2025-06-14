
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "@/lib/auth-client"
import { User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const AuthButton = () => {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <Button variant="ghost" disabled>Loading...</Button>
  }

  if (!session) {
    return (
      <Button variant="outline" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Sign In
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {session.user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
