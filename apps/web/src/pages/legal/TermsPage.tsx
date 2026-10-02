import { Link } from 'react-router-dom';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">OTIKO</Link>
          <div className="flex gap-4">
            <Link to="/explore" className="text-gray-700 hover:text-blue-600">Explore</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: October 3, 2026</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to OTIKO ("we", "our", "us"). These Terms of Service ("Terms") govern your access to and use of the OTIKO event ticketing platform, including our website, mobile applications, and services (collectively, the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Definitions</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Customer</strong> — any person who browses events or purchases tickets via the Service without creating an account.</li>
                <li><strong>Organizer</strong> — a registered user who creates and manages events on the Service.</li>
                <li><strong>Event</strong> — any concert, conference, party, workshop or gathering listed on the Service.</li>
                <li><strong>Ticket</strong> — a digital authorisation to attend an Event, issued after successful payment.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Customer Accounts</h2>
              <p className="text-gray-700 leading-relaxed">
                Customers do not require an account to browse or purchase tickets. When purchasing, you must provide a valid email address and phone number. You are responsible for the accuracy of your details — tickets are delivered to the email you provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Organizer Accounts</h2>
              <p className="text-gray-700 leading-relaxed">
                To become an Organizer, you must register and submit your organization details for review. All Organizer applications are subject to approval by our team. We reserve the right to reject or revoke any Organizer account at our discretion.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Organizers are solely responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                <li>The accuracy of event details (date, venue, pricing, capacity)</li>
                <li>Delivering the event as advertised</li>
                <li>Complying with all applicable laws (permits, licences, taxes)</li>
                <li>Handling attendee inquiries and refunds</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Ticket Purchases</h2>
              <p className="text-gray-700 leading-relaxed">
                All ticket purchases are final unless the Event is cancelled or rescheduled by the Organizer. Tickets are non-transferable unless the Service explicitly supports transfers.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Prices are displayed in Kenyan Shillings (KSh) unless otherwise stated. Payment is processed through M-Pesa or other approved payment providers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Refunds</h2>
              <p className="text-gray-700 leading-relaxed">
                Refunds are the responsibility of the Organizer. If an Event is cancelled, the Organizer must arrange refunds within 14 days. OTIKO is not liable for refunds but will cooperate in facilitating them where reasonably possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Ticket Validation</h2>
              <p className="text-gray-700 leading-relaxed">
                Each ticket contains a unique QR code. A ticket can only be validated once at the Event entrance. Duplicate scans will be rejected. Do not share your QR code publicly — anyone with the code can enter the Event.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Prohibited Conduct</h2>
              <p className="text-gray-700 leading-relaxed mb-2">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Use the Service for illegal purposes</li>
                <li>Create fake events or falsify ticket information</li>
                <li>Attempt to hack, scrape, or disrupt the Service</li>
                <li>Sell counterfeit tickets</li>
                <li>Harass other users or Organizers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The OTIKO name, logo, and platform code are our property. Content uploaded by Organizers (event descriptions, images) remains theirs — but you grant us a licence to display it on the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, OTIKO is not liable for any indirect, incidental, or consequential damages arising from your use of the Service — including cancelled events, missed events, or payment failures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Changes to These Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms from time to time. Continued use of the Service after changes means you accept the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of Kenya. Any disputes shall be resolved in the courts of Nairobi, Kenya.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                Questions about these Terms? Email us at <a href="mailto:legal@otiko.com" className="text-blue-600 hover:underline">legal@otiko.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}