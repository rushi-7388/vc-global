import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "./AuthProvider"

export const AuthButton = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading) {
    return <Button variant="ghost" disabled>Loading...</Button>
  }

  if (!user) {
    return (
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => navigate("/auth")}
      >
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
          {user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
