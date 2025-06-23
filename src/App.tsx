import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { preloadCriticalResources } from "@/utils/performanceOptimizations";
import { lazy, Suspense, useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AdminRoute } from "@/components/AdminRoute";
import CategoryProducts from "./pages/CategoryProducts";
import Consultation from "./pages/Consultation";
import ReachOut from "./pages/ReachOut";
import Quote from "./pages/Quote";
import Security from "./pages/Security";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFound from "./pages/NotFound";
import { supabase } from "./integrations/supabase/client";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Lazy load components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Products = lazy(() => import("./pages/Products"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));

// Enhanced QueryClient for extreme high-load scenarios
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
      refetchOnWindowFocus: import.meta.env.PROD,
    },
  },
});

const AppRoutes = () => {
  const navigate = useNavigate();
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSessionLoaded(true);
      if (event === "SIGNED_OUT") {
        // Don't force redirect on sign out, let user stay where they are
        console.log("User signed out");
      } else if (event === "SIGNED_IN") {
        // Only redirect to home if user was on auth page
        if (window.location.pathname === "/auth") {
          navigate("/");
        }
      }
    });

    // Check initial session without forcing redirects
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionLoaded(true);
      console.log("Session loaded:", !!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (!sessionLoaded) {
    return <LoadingSpinner size="lg" text="Loading session..." />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Index />} />
        <Route 
          path="/about" 
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/services" 
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/category/:categoryName" 
          element={
            <ProtectedRoute>
              <CategoryProducts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/consultation" 
          element={
            <ProtectedRoute>
              <Consultation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reach-out" 
          element={
            <ProtectedRoute>
              <ReachOut />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quote" 
          element={
            <ProtectedRoute>
              <Quote />
            </ProtectedRoute>
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
        <Route
          path="/security"
          element={
            <AdminRoute>
              <Security />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  useEffect(() => {
    // Register service worker for caching
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    }

    // Preload critical resources
    preloadCriticalResources();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
