
import { LoginForm } from "@/components/LoginForm"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const Auth = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}

export default Auth
