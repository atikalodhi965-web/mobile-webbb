import React from 'react';
import { Link } from 'react-router-dom';
import {
  PoundSterling,
  Package,
  CalendarCheck,
  ShoppingBag,
  Users,
  AlertTriangle,
  Wrench,
  Clock,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { adminStats, recentActivity, bookings, orders } from '../data/staticAdminData';

const typeDot = {
  booking: 'bg-sky-500',
  payment: 'bg-emerald-500',
  stock: 'bg-amber-500',
  order: 'bg-violet-500',
  user: 'bg-[#b8370e]',
};

const Dashboard = () => {
  const latestBookings = bookings.slice(0, 4);
  const latestOrders = orders.slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of repairs, bookings, and store sales"
        hideAction
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Revenue"
          value={`£${adminStats.revenue.toLocaleString()}`}
          subtitle="This month"
          icon={PoundSterling}
          accent
        />
        <StatCard
          title="Orders"
          value={adminStats.orders}
          subtitle={`${adminStats.lowStock} low stock items`}
          icon={Package}
        />
        <StatCard
          title="Bookings"
          value={adminStats.bookings}
          subtitle={`${adminStats.pendingBookings} pending`}
          icon={CalendarCheck}
        />
        <StatCard
          title="Repairs today"
          value={adminStats.repairsToday}
          subtitle={`${adminStats.products} products live`}
          icon={Wrench}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard title="Customers" value={adminStats.customers} icon={Users} />
        <StatCard title="Products" value={adminStats.products} icon={ShoppingBag} />
        <StatCard title="Pending bookings" value={adminStats.pendingBookings} icon={Clock} />
        <StatCard title="Low stock alerts" value={adminStats.lowStock} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-lg font-extrabold text-[#b8370e] mb-4">Recent activity</h2>
          <ul className="space-y-3">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex gap-3 items-start">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${typeDot[item.type] || 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm font-semibold text-[#1F1B2E] leading-snug">{item.text}</p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Latest bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#b8370e]">Latest bookings</h2>
            <Link to="/admin/bookings" className="text-xs font-bold text-[#1C0D2A] hover:text-[#b8370e]">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {latestBookings.map((b) => (
              <li
                key={b.id}
                className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-bold text-[#1C0D2A]">{b.customer}</p>
                  <p className="text-xs font-medium text-gray-500">
                    {b.device} · {b.repair}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {b.date} {b.time !== '—' ? `· ${b.time}` : ''}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        </div>

        {/* Latest orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#b8370e]">Latest orders</h2>
            <Link to="/admin/orders" className="text-xs font-bold text-[#1C0D2A] hover:text-[#b8370e]">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {latestOrders.map((o) => (
              <li
                key={o.id}
                className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-bold text-[#1C0D2A]">{o.id}</p>
                  <p className="text-xs font-medium text-gray-500">
                    {o.customer} · £{o.total}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 capitalize">
                    {o.type} · {o.payment}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={o.orderStatus} />
                  <StatusBadge status={o.paymentStatus} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
