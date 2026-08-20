import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../auth';

export default function AdminSettings() {
  const { user } = useAuth();
  return (
    <AdminLayout>
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
          <p className="text-sm text-gray-500">Role</p>
          <p className="text-lg font-semibold">{user?.role ?? '-'}</p>
        </div>
        <p className="text-sm text-gray-400 pt-4">Platform configuration is managed via environment variables on the server.</p>
      </div>
    </AdminLayout>
  );
}
