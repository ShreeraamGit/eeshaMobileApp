import { formatting } from '@eesha/shared';

export default function Home() {
  const testPrice = 299.99;

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Eesha Silks - Admin Dashboard
        </h1>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to the Admin Panel
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 font-medium">
                ✅ Monorepo setup successful!
              </p>
              <p className="text-green-700 text-sm mt-2">
                Shared package test: {formatting.formatPrice(testPrice)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-blue-900">Products</h3>
                <p className="text-blue-700 text-sm">Manage your inventory</p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                <h3 className="font-semibold text-purple-900">Orders</h3>
                <p className="text-purple-700 text-sm">
                  Track and fulfill orders
                </p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                <h3 className="font-semibold text-orange-900">Analytics</h3>
                <p className="text-orange-700 text-sm">View sales data</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">Next Steps:</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Configure Supabase connection</li>
                <li>Build product management interface</li>
                <li>Create order fulfillment workflow</li>
                <li>Add authentication</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
