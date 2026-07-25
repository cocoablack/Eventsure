import "./App.css";
import "./index.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./components/auth/ProtectedRoute";

const lazyNamed = (loader, name) => lazy(() => loader().then((module) => ({ default: module[name] })));
const Homepage = lazy(() => import("./pages/public/home"));
const LoginPage = lazy(() => import("./pages/public/login"));
const RegisterPage = lazy(() => import("./pages/public/register"));
const HowItWorksPage = lazy(() => import("./pages/public/howitworks"));
const PrivacyPolicy = lazy(() => import("./pages/public/privacypolicy"));
const TermsCondition = lazy(() => import("./pages/public/termsandconditions"));
const FindVendors = lazy(() => import("./pages/public/findvendors"));
const ContactSupport = lazy(() => import("./pages/public/contactsupport"));
const PublicVendorDetails = lazy(() => import("./pages/public/VendorDetails"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const UserDashboard = lazy(() => import("./pages/users/userdashboard"));
const CreateEvent = lazy(() => import("./pages/users/createevent"));
const BrowseVendors = lazy(() => import("./pages/users/browsevendors"));
const VendorProfileDetails = lazy(() => import("./pages/users/vendorprofiledetails"));
const BookingRequestDetails = lazy(() => import("./pages/users/bookingrequestdetails"));
const OfferNegotiation = lazy(() => import("./pages/users/offernegotiation"));
const Payment = lazy(() => import("./pages/users/payment"));
const ActiveBookings = lazy(() => import("./pages/users/activebookings"));
const CompletedBookings = lazy(() => import("./pages/users/completedbookings"));
const Messages = lazy(() => import("./pages/users/messages"));
const UserProfile = lazy(() => import("./pages/users/userprofile"));
const PersonalDetailChange = lazy(() => import("./pages/users/personaldetailchange"));
const AccountDeletion = lazy(() => import("./pages/users/accountdeletion"));
const Disputes = lazy(() => import("./pages/users/disputes"));
const userActivity = () => import("./pages/users/UserActivity");
const UserOffers = lazyNamed(userActivity, "UserOffers");
const UserPayments = lazyNamed(userActivity, "UserPayments");
const accountSettings = () => import("./pages/AccountSettings");
const UserAccountSettings = lazyNamed(accountSettings, "UserAccountSettings");
const VendorAccountSettings = lazyNamed(accountSettings, "VendorAccountSettings");
const VendorDashboard = lazy(() => import("./pages/vendor/vendordashboard"));
const KYCOnboarding = lazy(() => import("./pages/vendor/kyconboarding"));
const KYCStatus = lazy(() => import("./pages/vendor/kycstatus"));
const IncomingBookingRequests = lazy(() => import("./pages/vendor/incomingbookingrequests"));
const OfferResponse = lazy(() => import("./pages/vendor/offerresponse"));
const ActiveJobs = lazy(() => import("./pages/vendor/activejobs"));
const CompletedJobs = lazy(() => import("./pages/vendor/completedjobs"));
const VendorProfile = lazy(() => import("./pages/vendor/vendorprofile"));
const VendorPersonalDetailChange = lazy(() => import("./pages/vendor/personaldetailchange"));
const VendorAccountDeletion = lazy(() => import("./pages/vendor/accountdeletion"));
const VendorMessages = lazy(() => import("./pages/vendor/messages"));
const vendorTools = () => import("./pages/vendor/VendorTools");
const VendorPortfolio = lazyNamed(vendorTools, "VendorPortfolio");
const VendorSpotlight = lazyNamed(vendorTools, "VendorSpotlight");
const VendorSubscription = lazyNamed(vendorTools, "VendorSubscription");
const adminConsole = () => import("./pages/admin/AdminConsole");
const AdminDashboard = lazyNamed(adminConsole, "AdminDashboard");
const AdminDetailPage = lazyNamed(adminConsole, "AdminDetailPage");
const AdminListPage = lazyNamed(adminConsole, "AdminListPage");
const AdminPolicyEditor = lazyNamed(adminConsole, "AdminPolicyEditor");
const AdminReportsPage = lazyNamed(adminConsole, "AdminReportsPage");
const AdminSettingsPage = lazyNamed(adminConsole, "AdminSettingsPage");

function App() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500" aria-live="polite">Loading EventSure…</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsCondition />} />
        <Route path="/find-vendors" element={<FindVendors />} />
        <Route path="/vendors/:vendorId" element={<PublicVendorDetails />} />
        <Route path="/contact" element={<ContactSupport />} />

        <Route element={<ProtectedRoute roles={["user"]} />}>
        {/* User Routes  */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/create-event" element={<CreateEvent />} />
        <Route path="/user/browse-vendors" element={<BrowseVendors />} />
        <Route
          path="/user/vendors/:vendorId"
          element={<VendorProfileDetails />}
        />
        <Route
          path="/user/bookings/:bookingId"
          element={<BookingRequestDetails />}
        />
        <Route
          path="/user/bookings/:bookingId/offer"
          element={<OfferNegotiation />}
        />
        <Route path="/user/bookings/:bookingId/payment" element={<Payment />} />
        <Route path="/user/bookings" element={<ActiveBookings />} />
        <Route
          path="/user/bookings/completed"
          element={<CompletedBookings />}
        />
        <Route path="/user/messages" element={<Messages />} />
        <Route path="/user/disputes" element={<Disputes />} />
        <Route path="/user/offers" element={<UserOffers />} />
        <Route path="/user/payments" element={<UserPayments />} />
        <Route path="/user/notifications" element={<Messages initialTab="notifications" />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/settings" element={<UserAccountSettings />} />
        <Route
          path="/user/profile/change-request"
          element={<PersonalDetailChange />}
        />
        <Route
          path="/user/profile/delete-account"
          element={<AccountDeletion />}
        />
        </Route>

        {/* Vendor Routes */}
        <Route element={<ProtectedRoute roles={["vendor"]} />}>
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/kyc" element={<KYCOnboarding />} />
        <Route path="/vendor/kyc-status" element={<KYCStatus />} />
        <Route
          path="/vendor/booking-requests"
          element={<IncomingBookingRequests />}
        />
        <Route
          path="/vendor/booking-requests/:requestId/respond"
          element={<OfferResponse />}
        />
        <Route path="/vendor/active-jobs" element={<ActiveJobs />} />
        <Route path="/vendor/completed-jobs" element={<CompletedJobs />} />
        <Route path="/vendor/messages" element={<VendorMessages />} />
        <Route path="/vendor/subscription" element={<VendorSubscription />} />
        <Route path="/vendor/spotlight" element={<VendorSpotlight />} />
        <Route path="/vendor/portfolio" element={<VendorPortfolio />} />
        <Route path="/vendor/profile" element={<VendorProfile />} />
        <Route path="/vendor/settings" element={<VendorAccountSettings />} />
        <Route
          path="/vendor/profile/change-request"
          element={<VendorPersonalDetailChange />}
        />
        <Route
          path="/vendor/profile/delete-account"
          element={<VendorAccountDeletion />}
        />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminListPage type="users" />} />
        <Route path="/admin/users/:userId" element={<AdminDetailPage type="user" />} />
        <Route path="/admin/vendors" element={<AdminListPage type="vendors" />} />
        <Route path="/admin/vendors/:vendorId" element={<AdminDetailPage type="vendor" />} />
        <Route path="/admin/kyc-reviews" element={<AdminListPage type="kyc" />} />
        <Route
          path="/admin/kyc-reviews/:reviewId"
          element={<AdminDetailPage type="kyc" />}
        />
        <Route path="/admin/bookings" element={<AdminListPage type="bookings" />} />
        <Route path="/admin/bookings/:bookingId" element={<AdminDetailPage type="booking" />} />
        <Route path="/admin/payments" element={<AdminListPage type="payments" />} />
        <Route path="/admin/payments/:paymentId" element={<AdminDetailPage type="payment" />} />
        <Route path="/admin/spotlight" element={<AdminListPage type="spotlight" />} />
        <Route
          path="/admin/subscriptions"
          element={<AdminListPage type="subscriptions" />}
        />
        <Route
          path="/admin/change-requests"
          element={<AdminListPage type="changes" />}
        />
        <Route
          path="/admin/change-requests/:requestId"
          element={<AdminDetailPage type="change" />}
        />
        <Route path="/admin/deletion-requests" element={<AdminListPage type="deletions" />} />
        <Route path="/admin/deletion-requests/:requestId" element={<AdminDetailPage type="deletion" />} />
        <Route path="/admin/disputes" element={<AdminListPage type="disputes" />} />
        <Route path="/admin/disputes/:disputeId" element={<AdminDetailPage type="dispute" />} />
        <Route path="/admin/policies" element={<AdminListPage type="policies" />} />
        <Route
          path="/admin/policies/:policyId/edit"
          element={<AdminPolicyEditor />}
        />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/staff" element={<AdminListPage type="staff" />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/notifications" element={<AdminListPage type="notifications" />} />
        <Route path="/admin/audit-log" element={<AdminListPage type="audit" />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
