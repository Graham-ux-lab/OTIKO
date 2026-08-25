import { OrganizerLayout } from '../../components/OrganizerLayout';

export default function OrganizerCoupons() {
  return (
    <OrganizerLayout>
      <h2 className="text-3xl font-bold mb-8">Coupons</h2>
      <div className="bg-white rounded-lg shadow p-10 text-center">
        <div className="text-5xl mb-4"></div>
        <h3 className="text-xl font-semibold">No discount codes yet</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">Create promo codes to offer early-bird and percentage discounts on your events. This feature is coming soon.</p>
      </div>
    </OrganizerLayout>
  );
}
