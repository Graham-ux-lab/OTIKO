import { OrganizerLayout } from '../../components/OrganizerLayout';

export default function OrganizerNotifications() {
  return (
    <OrganizerLayout>
      <h2 className="text-3xl font-bold mb-8">Notifications</h2>
      <div className="bg-white rounded-lg shadow p-10 text-center">
        <div className="text-5xl mb-4">🔔</div>
        <h3 className="text-xl font-semibold">You're all caught up</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">New ticket sales, payout updates, and attendee activity will appear here. This feature is coming soon.</p>
      </div>
    </OrganizerLayout>
  );
}
