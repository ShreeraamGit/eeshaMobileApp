import { requireAdmin } from '@/lib/auth/adminAuthService';

export default async function AdminDashboardPage() {
  // This will redirect to /admin/login if not authenticated as admin
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-black mb-2" style={{ fontFamily: 'Tenor Sans, serif' }}>
            Admin Dashboard
          </h1>
          <p className="text-base text-gray-600">
            Welcome back, {user.email}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Orders" value="0" />
          <StatCard title="Products" value="1" />
          <StatCard title="Customers" value="0" />
          <StatCard title="Revenue" value="€0" />
        </div>

        {/* Content Placeholder */}
        <div className="bg-white border border-gray-200 rounded p-8">
          <h2 className="text-xl font-normal text-black mb-4" style={{ fontFamily: 'Tenor Sans, serif' }}>
            Recent Activity
          </h2>
          <p className="text-gray-600">
            Your admin dashboard is ready. Start by managing products, orders, and customers.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h3 className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tenor Sans, serif' }}>
        {title}
      </h3>
      <p className="text-3xl font-normal text-black" style={{ fontFamily: 'Tenor Sans, serif' }}>
        {value}
      </p>
    </div>
  );
}
