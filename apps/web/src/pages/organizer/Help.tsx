import { OrganizerLayout } from '../../components/OrganizerLayout';

const faqs = [
  { q: 'How do I create an event?', a: 'Go to Events → Create New Event, fill in the details, add a ticket type, and publish it when ready.' },
  { q: 'When do I get paid?', a: 'Payouts are calculated as gross sales minus the 10% platform fee. Withdrawals are processed per your payout schedule.' },
  { q: 'How do attendees check in?', a: 'Each ticket has a unique QR code. Use the Scanner tool to validate tickets at the door.' },
  { q: 'Can I offer discounts?', a: 'Coupons are on the way — you will be able to create promo codes from the Coupons section.' },
];

export default function OrganizerHelp() {
  return (
    <OrganizerLayout>
      <h2 className="text-3xl font-bold mb-8">Help & Support</h2>
      <div className="space-y-4 max-w-3xl">
        {faqs.map((f) => (
          <div key={f.q} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg">{f.q}</h3>
            <p className="text-gray-600 mt-2">{f.a}</p>
          </div>
        ))}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Need more help? Email <span className="font-semibold text-purple-700">support@otiko.ke</span> and we'll get back to you.</p>
        </div>
      </div>
    </OrganizerLayout>
  );
}
