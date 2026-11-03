import React, { useMemo } from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import { userApi } from '../services/adminApi';
import { Shield, User, UserCheck, Mail, Phone, Calendar } from 'lucide-react';

/* ─── Role badge helper ─── */
const RoleBadge = ({ role }) => {
  switch (role) {
    case 'admin':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-xs">
          <Shield className="w-3.5 h-3.5 text-purple-600" />
          Admin (1 allowed)
        </span>
      );
    case 'staff':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
          Staff (Optional)
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <User className="w-3.5 h-3.5 text-emerald-600" />
          Customer
        </span>
      );
  }
};

/* ─── Status badge helper ─── */
const StatusBadge = ({ active }) =>
  active ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
      Inactive
    </span>
  );

const COLUMNS = [
  {
    key: 'name',
    label: 'User Name',
    render: (r) => (
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-xs ${
            r.role === 'admin'
              ? 'bg-purple-100 text-purple-700 border border-purple-300'
              : r.role === 'staff'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-orange-100 text-[#b8370e] border border-orange-200'
          }`}
        >
          {r.name ? r.name.charAt(0) : 'U'}
        </div>
        <div>
          <p className="font-bold text-[#1F1B2E] text-sm leading-snug">{r.name || 'Unnamed'}</p>
          <span className="text-[11px] font-mono text-gray-400">ID: {(r._id || r.id)?.slice(-6)}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Email Address',
    render: (r) => (
      <div className="flex items-center gap-1.5 text-sm text-gray-700">
        <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span className="font-medium">{r.email}</span>
      </div>
    ),
  },
  {
    key: 'phone',
    label: 'Phone',
    render: (r) =>
      r.phone ? (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-mono">
          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span>{r.phone}</span>
        </div>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: 'role',
    label: 'Role',
    render: (r) => <RoleBadge role={r.role} />,
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (r) => <StatusBadge active={r.isActive} />,
  },
  {
    key: 'createdAt',
    label: 'Joined Date',
    render: (r) => {
      const dateVal = r.createdAt || r.joined;
      return (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span>
            {dateVal
              ? new Date(dateVal).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'}
          </span>
        </div>
      );
    },
  },
];

const UsersPage = () => {
  const resource = useAdminResource(userApi);
  const { items } = resource;

  // Check if an admin account already exists in the system
  const hasExistingAdmin = useMemo(() => {
    return items.some((u) => u.role === 'admin');
  }, [items]);

  // Compute stat counts for overview badges
  const stats = useMemo(() => {
    const adminCount = items.filter((u) => u.role === 'admin').length;
    const staffCount = items.filter((u) => u.role === 'staff').length;
    const customerCount = items.filter((u) => u.role === 'customer' || (!u.role && u.role !== 'admin' && u.role !== 'staff')).length;
    return {
      total: items.length,
      admin: adminCount,
      staff: staffCount,
      customer: customerCount,
    };
  }, [items]);

  // Role dropdown options enforcing: admin should only be 1 and staff is optional
  const roleOptions = useMemo(() => {
    const opts = [
      { value: 'customer', label: 'Customer (Default)' },
      { value: 'staff', label: 'Staff (Store Staff - Optional)' },
    ];
    // If no admin exists in the system, allow adding the 1 admin
    if (!hasExistingAdmin) {
      opts.push({ value: 'admin', label: 'Admin (System Administrator - Only 1 Allowed)' });
    }
    return opts;
  }, [hasExistingAdmin]);

  // Form fields according to backend User model schema:
  // - name (required, trim)
  // - email (required, unique, lowercase)
  // - password (required for create, minlength 6)
  // - phone (optional)
  // - role (enum: ['customer', 'staff', 'admin'], default: 'customer')
  // - isActive (boolean, default: true)
  // - marketingOptIn (boolean, default: false)
  const FORM_FIELDS = [
    {
      name: 'name',
      label: 'Full Name',
      required: true,
      placeholder: 'e.g. John Doe',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'john@example.com',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Min 6 characters (leave empty to keep unchanged on edit)',
      hint: 'Required when adding a new user; min 6 characters.',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      placeholder: 'e.g. +44 7123 456789',
      hint: 'Optional contact number',
    },
    {
      name: 'role',
      label: 'User Role',
      type: 'select',
      options: roleOptions,
      defaultValue: 'customer',
      hint: 'Admin is strictly limited to 1 in the system. Staff is an optional role.',
    },
    {
      name: 'isActive',
      label: 'Active Account',
      type: 'checkbox',
      defaultValue: true,
      hint: 'Allow user to sign in and place orders / bookings',
    },
    {
      name: 'marketingOptIn',
      label: 'Marketing Opt-In',
      type: 'checkbox',
      defaultValue: false,
      hint: 'Subscribed to promotional emails & updates',
    },
  ];

  // Build and validate payload matching backend User schema
  const buildPayload = (vals, editRow) => {
    const isEditing = !!editRow;

    // Validate name
    if (!vals.name || !vals.name.trim()) {
      throw new Error('Full Name is required.');
    }

    // Validate email
    if (!vals.email || !/^\S+@\S+\.\S+$/.test(vals.email.trim())) {
      throw new Error('A valid email address is required.');
    }

    // Validate password
    if (!isEditing) {
      if (!vals.password || vals.password.length < 6) {
        throw new Error('Password is required and must be at least 6 characters.');
      }
    } else if (vals.password && vals.password.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    // Role enforcement
    let role = vals.role || 'customer';
    if (isEditing && editRow.role === 'admin') {
      // Primary admin cannot be demoted if it's the only admin
      role = 'admin';
    } else if (role === 'admin' && hasExistingAdmin && (!isEditing || editRow.role !== 'admin')) {
      throw new Error('Only 1 admin account is allowed in the system. An admin already exists.');
    }

    const payload = {
      name: vals.name.trim(),
      email: vals.email.toLowerCase().trim(),
      phone: vals.phone ? vals.phone.trim() : '',
      role,
      isActive: vals.isActive !== false,
      marketingOptIn: !!vals.marketingOptIn,
    };

    if (vals.password && vals.password.trim()) {
      payload.password = vals.password.trim();
    }

    return payload;
  };

  // Protect Admin from deletion on the client-side as well
  const protectedResource = useMemo(
    () => ({
      ...resource,
      remove: async (id) => {
        const target = items.find((u) => (u._id || u.id) === id);
        if (target && target.role === 'admin') {
          throw new Error('The primary admin account cannot be deleted. The system must always have 1 admin.');
        }
        return resource.remove(id);
      },
    }),
    [resource, items]
  );

  return (
    <div>
      {/* ── Overview stats summary banner ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Users</p>
          <p className="text-2xl font-extrabold text-[#1F1B2E] mt-1">{stats.total}</p>
          <span className="text-[11px] text-gray-500">All registered accounts</span>
        </div>
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs bg-gradient-to-br from-purple-50/40 to-white">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Admin Account</p>
          <p className="text-2xl font-extrabold text-purple-700 mt-1">{stats.admin} <span className="text-xs font-normal text-purple-500">/ 1 Max</span></p>
          <span className="text-[11px] text-purple-600 font-medium">Strictly 1 admin enforced</span>
        </div>
        <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-xs bg-gradient-to-br from-blue-50/40 to-white">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Store Staff</p>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">{stats.staff}</p>
          <span className="text-[11px] text-blue-500 font-medium">Optional staff members</span>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-xs bg-gradient-to-br from-emerald-50/40 to-white">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Customers</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.customer}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Store customers</span>
        </div>
      </div>

      <AdminLivePage
        title="Customers & Staff"
        subtitle="Manage user accounts from the User table (strictly 1 Admin, optional Staff, and Customers)"
        actionLabel="Add User"
        columns={COLUMNS}
        searchKeys={['name', 'email', 'phone', 'role']}
        searchPlaceholder="Search users by name, email, phone or role…"
        resource={protectedResource}
        formFields={FORM_FIELDS}
        buildPayload={buildPayload}
      />
    </div>
  );
};
// >>>>>>> 8f997a0 (Fix frontend tracking)

export default UsersPage;
