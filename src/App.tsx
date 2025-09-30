import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import AssistancePage from "./pages/AssistancePage";
import GeographicDemo from "./pages/GeographicDemo";
import FAQPage from "./pages/FAQPage";
import ClientLogin from "./pages/ClientLogin";
import ClientDashboard from "./pages/ClientDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/NewAdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TestResetPassword from "./pages/TestResetPassword";
import AuthTest from "./pages/AuthTest";
import DirectAuthTest from "./pages/DirectAuthTest";
import EmergencyAdmin from "./pages/EmergencyAdmin";
import AdminInvitations from "./pages/AdminInvitations";
import ClientActivation from "./pages/ClientActivation";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="assistance" element={<AssistancePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="geographic-demo" element={<GeographicDemo />} />
            <Route path="faq" element={<FAQPage />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="client-login" element={<ClientLogin />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="test-reset-password" element={<TestResetPassword />} />
          <Route path="auth-test" element={<AuthTest />} />
          <Route path="direct-auth-test" element={<DirectAuthTest />} />
          <Route path="emergency-admin" element={<EmergencyAdmin />} />
          <Route path="client-activation" element={<ClientActivation />} />
          <Route path="admin" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route
            path="client-dashboard"
            element={
              <PrivateRoute requiredRole="client">
                <ClientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="admin-dashboard"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="admin-invitations"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminInvitations />
              </PrivateRoute>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
