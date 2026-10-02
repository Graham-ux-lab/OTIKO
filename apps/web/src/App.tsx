import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import OrganizerSignupPage from './pages/OrganizerSignupPage';
import VerifyEmailPage from './pages/verify-email/[token]';
import AboutPage from './pages/AboutPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrganizers from './pages/admin/Organizers';
import AdminUsers from './pages/admin/Users';
import AdminEvents from './pages/admin/Events';
import AdminOrders from './pages/admin/Orders';
import AdminPayments from './pages/admin/Payments';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import OrganizerDashboard from './pages/organizer/Dashboard';
import OrganizerEvents from './pages/organizer/Events';
import OrganizerCreateEvent from './pages/organizer/CreateEvent';
import OrganizerOrders from './pages/organizer/Orders';
import OrganizerAttendees from './pages/organizer/Attendees';
import OrganizerAnalytics from './pages/organizer/Analytics';
import OrganizerPayouts from './pages/organizer/Payouts';
import OrganizerSettings from './pages/organizer/Settings';
import { ProtectedRoute } from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/organizer-signup" element={<OrganizerSignupPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/organizers" element={<ProtectedRoute role="ADMIN"><AdminOrganizers /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute role="ADMIN"><AdminEvents /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute role="ADMIN"><AdminPayments /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute role="ADMIN"><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute role="ADMIN"><AdminSettings /></ProtectedRoute>} />
        <Route path="/organizer" element={<ProtectedRoute role="ORGANIZER"><OrganizerDashboard /></ProtectedRoute>} />
        <Route path="/organizer/events" element={<ProtectedRoute role="ORGANIZER"><OrganizerEvents /></ProtectedRoute>} />
        <Route path="/organizer/events/new" element={<ProtectedRoute role="ORGANIZER"><OrganizerCreateEvent /></ProtectedRoute>} />
        <Route path="/organizer/orders" element={<ProtectedRoute role="ORGANIZER"><OrganizerOrders /></ProtectedRoute>} />
        <Route path="/organizer/attendees" element={<ProtectedRoute role="ORGANIZER"><OrganizerAttendees /></ProtectedRoute>} />
        <Route path="/organizer/analytics" element={<ProtectedRoute role="ORGANIZER"><OrganizerAnalytics /></ProtectedRoute>} />
        <Route path="/organizer/payouts" element={<ProtectedRoute role="ORGANIZER"><OrganizerPayouts /></ProtectedRoute>} />
        <Route path="/organizer/settings" element={<ProtectedRoute role="ORGANIZER"><OrganizerSettings /></ProtectedRoute>} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
