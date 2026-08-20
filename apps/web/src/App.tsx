import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth';
import { ProtectedRoute } from './ProtectedRoute';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyTicketsPage from './pages/MyTicketsPage';
import EventDetailsPage from './pages/events/[id]';
import CheckoutPage from './pages/checkout/[eventId]';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OrganizerApplyPage from './pages/OrganizerApplyPage';
import ScannerPage from './pages/scanner/ScannerPage';
import OrganizerDashboard from './pages/organizer/Dashboard';
import OrganizerEvents from './pages/organizer/Events';
import CreateEvent from './pages/organizer/CreateEvent';
import OrganizerOrders from './pages/organizer/Orders';
import OrganizerAttendees from './pages/organizer/Attendees';
import OrganizerAnalytics from './pages/organizer/Analytics';
import PayoutsPage from './pages/organizer/Payouts';
import OrganizerSettings from './pages/organizer/Settings';
import OrganizerCoupons from './pages/organizer/Coupons';
import OrganizerNotifications from './pages/organizer/Notifications';
import OrganizerHelp from './pages/organizer/Help';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrganizers from './pages/admin/Organizers';
import AdminEvents from './pages/admin/Events';
import AdminOrders from './pages/admin/Orders';
import AdminPayments from './pages/admin/Payments';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/my-tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/checkout/:eventId/:ticketId" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/apply-organizer" element={<OrganizerApplyPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        
        <Route path="/organizer" element={<ProtectedRoute role="ORGANIZER"><OrganizerDashboard /></ProtectedRoute>} />
        <Route path="/organizer/events" element={<ProtectedRoute role="ORGANIZER"><OrganizerEvents /></ProtectedRoute>} />
        <Route path="/organizer/events/new" element={<ProtectedRoute role="ORGANIZER"><CreateEvent /></ProtectedRoute>} />
        <Route path="/organizer/orders" element={<ProtectedRoute role="ORGANIZER"><OrganizerOrders /></ProtectedRoute>} />
        <Route path="/organizer/attendees" element={<ProtectedRoute role="ORGANIZER"><OrganizerAttendees /></ProtectedRoute>} />
        <Route path="/organizer/analytics" element={<ProtectedRoute role="ORGANIZER"><OrganizerAnalytics /></ProtectedRoute>} />
        <Route path="/organizer/payouts" element={<ProtectedRoute role="ORGANIZER"><PayoutsPage /></ProtectedRoute>} />
        <Route path="/organizer/settings" element={<ProtectedRoute role="ORGANIZER"><OrganizerSettings /></ProtectedRoute>} />
        <Route path="/organizer/coupons" element={<ProtectedRoute role="ORGANIZER"><OrganizerCoupons /></ProtectedRoute>} />
        <Route path="/organizer/notifications" element={<ProtectedRoute role="ORGANIZER"><OrganizerNotifications /></ProtectedRoute>} />
        <Route path="/organizer/help" element={<ProtectedRoute role="ORGANIZER"><OrganizerHelp /></ProtectedRoute>} />
        
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/organizers" element={<ProtectedRoute role="ADMIN"><AdminOrganizers /></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute role="ADMIN"><AdminEvents /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute role="ADMIN"><AdminPayments /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute role="ADMIN"><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute role="ADMIN"><AdminSettings /></ProtectedRoute>} />
      </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;