import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AdminRoute } from "@/components/AdminRoute"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { AuthProvider } from "@/components/AuthProvider"

// Pages
import Index from "@/pages/Index"
import About from "@/pages/About"
import Products from "@/pages/Products"
import ProductDetailPage from "@/pages/ProductDetailPage"
import CategoryProducts from "@/pages/CategoryProducts"
import Contact from "@/pages/Contact"
import Services from "@/pages/Services"
import Consultation from "@/pages/Consultation"
import Quote from "@/pages/Quote"
import ReachOut from "@/pages/ReachOut"
import Auth from "@/pages/Auth"
import Security from "@/pages/Security"
import AdminProducts from "@/pages/AdminProducts"
import NotFound from "@/pages/NotFound"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/category/:category" element={<CategoryProducts />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/quote" element={<Quote />} />
                <Route path="/reach-out" element={<ReachOut />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/security" 
                  element={
                    <AdminRoute>
                      <div className="container mx-auto px-4 py-8">
                        <Security />
                      </div>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
