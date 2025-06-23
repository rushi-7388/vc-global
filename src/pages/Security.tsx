import { AdminSecurityDashboard } from '@/components/AdminSecurityDashboard';
import { AdminRoute } from '@/components/AdminRoute';

export default function Security() {
  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-8">
        <AdminSecurityDashboard />
      </div>
    </AdminRoute>
  );
} 