import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: October 3, 2026</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                OTIKO ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our event ticketing platform.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                We comply with the Kenya Data Protection Act (2019) and applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-3"><strong>When you purchase a ticket (as a guest):</strong></p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number (for M-Pesa payment)</li>
                <li>Order and ticket details</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-3 mt-4"><strong>When you register as an Organizer:</strong></p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Full name</li>
                <li>Email address and phone number</li>
                <li>Organization name and description</li>
                <li>Password (hashed with Argon2 — we never store plain passwords)</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-3 mt-4"><strong>Automatically collected:</strong></p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>IP address</li>
                <li>Browser type and device info</li>
                <li>Pages visited and time spent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>To process ticket purchases and issue tickets</li>
                <li>To send transaction receipts and event tickets via email</li>
                <li>To validate tickets at the event entrance</li>
                <li>To review and approve Organizer applications</li>
                <li>To communicate service updates or event changes</li>
                <li>To detect and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Payment Information</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not store your M-Pesa PIN or full payment credentials. Payments are processed through M-Pesa (Safaricom) and their secure infrastructure. We receive only a transaction confirmation code and status.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Sharing Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">We may share your information with:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Organizers</strong> — to allow them to know who purchased tickets, and to check attendees in at the door</li>
                <li><strong>Payment processors</strong> — such as Safaricom M-Pesa, to complete your transaction</li>
                <li><strong>Email providers</strong> — to deliver your tickets and notifications</li>
                <li><strong>Legal authorities</strong> — when required by law</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We never sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal data for as long as your tickets or orders exist. Order records are kept for 7 years for tax and audit purposes. You may request deletion of your data at any time (see Section 9).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                <li>Keep you logged in (authentication cookies)</li>
                <li>Remember your preferences</li>
                <li>Analyze site traffic and improve the Service</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                You can manage cookies through the cookie banner or your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We use industry-standard security measures including HTTPS encryption, hashed passwords (Argon2), JWT-based authentication, and secure database access. However, no online service is 100% secure — use strong passwords and keep your credentials private.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-3">Under the Kenya Data Protection Act, you have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing</li>
                <li>Request data portability</li>
                <li>Lodge a complaint with the Office of the Data Protection Commissioner (ODPC)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise these rights, email <a href="mailto:privacy@otiko.com" className="text-blue-600 hover:underline">privacy@otiko.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Service is not intended for children under 18. We do not knowingly collect data from minors. If you believe we have, contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. International Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Our servers may be located outside Kenya. Where we transfer data internationally, we ensure appropriate safeguards are in place.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this policy from time to time. Material changes will be notified via email or a prominent notice on our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                Questions about this Privacy Policy? Email us at <a href="mailto:privacy@otiko.com" className="text-blue-600 hover:underline">privacy@otiko.com</a> or write to us at Nairobi, Kenya.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}