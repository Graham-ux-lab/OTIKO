import { OrganizerLayout } from '../../components/OrganizerLayout';
import { useAuth } from '../../auth';

export default function OrganizerSettings() {
  const { user } = useAuth();
  return (
    <OrganizerLayout>
      <h2 className="text-3xl font-bold mb-8">Settings</h2>
      <div className="bg-white rounded-lg shadow p-8 max-w-lg space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-semibold">{user?.name ?? '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-semibold">{user?.email ?? '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="text-lg font-semibold">{user?.phone ?? '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="text-lg font-semibold">{user?.role ?? '-'}</p>
        </div>
      </div>
    </OrganizerLayout>
  );
}
