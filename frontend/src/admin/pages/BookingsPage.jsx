<<<<<<< HEAD
import React from 'react';
import AdminResourcePage from '../components/AdminResourcePage';
import StatusBadge from '../components/StatusBadge';
import { bookings } from '../data/staticAdminData';

const BookingsPage = () => (
  <AdminResourcePage
    title="Repair Bookings"
    subtitle="Visit-us and mail-in appointments — update status and store"
    actionLabel="New Booking"
    searchKeys={['id', 'customer', 'device', 'repair', 'method', 'store', 'status']}
    searchPlaceholder="Search bookings…"
    rows={bookings}
    columns={[
      { key: 'id', label: 'Booking' },
      { key: 'customer', label: 'Customer' },
      { key: 'device', label: 'Device' },
      { key: 'repair', label: 'Repair' },
      {
        key: 'method',
        label: 'Method',
        render: (r) => <span className="capitalize">{r.method.replace(/-/g, ' ')}</span>,
      },
      { key: 'store', label: 'Store' },
      {
        key: 'schedule',
        label: 'Schedule',
        render: (r) => `${r.date}${r.time !== '—' ? ` · ${r.time}` : ''}`,
=======
import React, { useEffect, useState, useMemo } from 'react';
import AdminLivePage from '../components/AdminLivePage';
import StatusBadge from '../components/StatusBadge';
import useAdminResource from '../hooks/useAdminResource';
import {
  bookingApi,
  deviceModelApi,
  repairServiceApi,
  apiClient,
} from '../services/adminApi';
import {
  Wrench,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Smartphone,
  Shield,
  FileText,
  DollarSign,
  CheckCircle,
  Truck,
  Store as StoreIcon,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const METHOD_OPTIONS = [
  { value: 'visit-us', label: 'In-Store Walk In (Visit Us)' },
  { value: 'mail-in', label: 'Mail-In Postal Repair' },
];

const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
];

const BookingsPage = () => {
  const resource = useAdminResource(bookingApi);
  const [models, setModels] = useState([]);
  const [services, setServices] = useState([]);
  const [stores, setStores] = useState([]);

  // Fetch catalog options for dropdowns
  useEffect(() => {
    deviceModelApi
      .getAll({ limit: 100 })
      .then((res) => setModels(res?.items ?? res ?? []))
      .catch(() => {});

    repairServiceApi
      .getAll({ limit: 100 })
      .then((res) => setServices(res?.items ?? res ?? []))
      .catch(() => {});

    apiClient
      .get('/admin/cms/store')
      .then((res) => {
        const data = res?.data?.data ?? res?.data;
        if (data) setStores([data]);
      })
      .catch(() => {});
  }, []);

  const COLUMNS = useMemo(
    () => [
      {
        key: 'bookingNumber',
        label: 'Booking #',
        render: (r) => (
          <div>
            <span className="font-mono text-xs font-bold text-[#b8370e] bg-[#b8370e]/10 px-2 py-0.5 rounded-md">
              {r.bookingNumber || (r._id ? `BK-${r._id.slice(-6).toUpperCase()}` : '—')}
            </span>
            <span className="block text-[10px] text-gray-400 mt-0.5">
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
            </span>
          </div>
        ),
      },
      {
        key: 'customer',
        label: 'Customer',
        render: (r) => {
          const c = r.customer || {};
          const name = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Guest';
          return (
            <div>
              <p className="font-bold text-[#1F1B2E] text-sm">{name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                {c.phone && <span>{c.phone}</span>}
                {c.email && <span className="text-gray-400">· {c.email}</span>}
              </div>
            </div>
          );
        },
      },
      {
        key: 'deviceName',
        label: 'Device',
        render: (r) => {
          const dev = r.deviceName || r.deviceModelId?.name || 'Device';
          return (
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-medium text-xs text-gray-800">{dev}</span>
            </div>
          );
        },
      },
      {
        key: 'repairs',
        label: 'Repair / Problem',
        render: (r) => {
          const snaps = r.repairSnapshot || [];
          if (snaps.length > 0) {
            return (
              <span className="text-xs font-semibold text-gray-700">
                {snaps.map((s) => s.title).join(', ')}
              </span>
            );
          }
          if (r.repairServiceIds?.length > 0) {
            return (
              <span className="text-xs font-semibold text-gray-700">
                {r.repairServiceIds.map((s) => s.title || s).join(', ')}
              </span>
            );
          }
          return <span className="text-xs text-gray-400">Diagnostic Check</span>;
        },
      },
      {
        key: 'method',
        label: 'Method',
        render: (r) =>
          r.method === 'visit-us' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
              <StoreIcon className="w-3 h-3" />
              Visit Store
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Truck className="w-3 h-3" />
              Mail-In
            </span>
          ),
      },
      {
        key: 'schedule',
        label: 'Schedule',
        render: (r) => {
          if (r.method === 'mail-in') {
            return <span className="text-xs text-gray-400 italic">Postal Pack</span>;
          }
          const d = r.appointmentDate ? new Date(r.appointmentDate).toLocaleDateString() : '—';
          const t = r.appointmentTime || '';
          return (
            <span className="text-xs font-medium text-gray-700">
              {d} {t && <strong className="text-gray-900 ml-1 font-bold">· {t}</strong>}
            </span>
          );
        },
>>>>>>> 8f997a0 (Fix frontend tracking)
      },
      {
        key: 'total',
        label: 'Total',
<<<<<<< HEAD
        render: (r) => `£${r.total}`,
=======
        render: (r) => (
          <span className="font-bold text-[#b8370e] text-sm">
            £{r.total !== undefined ? Number(r.total).toFixed(2) : '0.00'}
          </span>
        ),
>>>>>>> 8f997a0 (Fix frontend tracking)
      },
      {
        key: 'status',
        label: 'Status',
<<<<<<< HEAD
        render: (r) => <StatusBadge status={r.status} />,
      },
    ]}
  />
);
=======
        render: (r) => <StatusBadge status={r.status || 'pending'} />,
      },
    ],
    []
  );

  return (
    <AdminLivePage
      title="Repair Bookings"
      subtitle="Live in-store and mail-in customer bookings & manual repair booking entry"
      actionLabel="Add Booking"
      columns={COLUMNS}
      searchKeys={['bookingNumber', 'deviceName', 'method', 'status']}
      searchPlaceholder="Search by booking #, device, customer name or status…"
      resource={resource}
      renderCustomForm={({ editRow, closeForm, resource: res, saving, formError, setFormError }) => (
        <BookingFormModal
          editRow={editRow}
          closeForm={closeForm}
          resource={res}
          saving={saving}
          formError={formError}
          setFormError={setFormError}
          models={models}
          services={services}
          stores={stores}
        />
      )}
    />
  );
};

/* ─── Add / Edit Booking Form Component ─── */
const BookingFormModal = ({
  editRow,
  closeForm,
  resource,
  saving,
  formError,
  setFormError,
  models = [],
  services = [],
  stores = [],
}) => {
  const isEdit = !!editRow;

  // Customer State
  const [firstName, setFirstName] = useState(editRow?.customer?.firstName || '');
  const [lastName, setLastName] = useState(editRow?.customer?.lastName || '');
  const [email, setEmail] = useState(editRow?.customer?.email || '');
  const [phone, setPhone] = useState(editRow?.customer?.phone || '');
  const [postcode, setPostcode] = useState(editRow?.customer?.postcode || '');
  const [devicePasscode, setDevicePasscode] = useState(editRow?.customer?.devicePasscode || '');
  const [mobileNetwork, setMobileNetwork] = useState(editRow?.customer?.mobileNetwork || '');
  const [additionalInfo, setAdditionalInfo] = useState(
    editRow?.customer?.additionalInfo || ''
  );

  // Device & Repair State
  const [deviceName, setDeviceName] = useState(editRow?.deviceName || '');
  const [deviceModelId, setDeviceModelId] = useState(
    editRow?.deviceModelId?._id || editRow?.deviceModelId || ''
  );
  const [selectedServiceId, setSelectedServiceId] = useState(
    editRow?.repairSnapshot?.[0]?.repairServiceId || editRow?.repairServiceIds?.[0] || ''
  );
  const [customRepairTitle, setCustomRepairTitle] = useState(
    editRow?.repairSnapshot?.[0]?.title || ''
  );
  const [repairPrice, setRepairPrice] = useState(
    editRow?.total !== undefined ? editRow.total : 49
  );

  // Appointment & Method
  const [method, setMethod] = useState(editRow?.method || 'visit-us');
  const [storeId, setStoreId] = useState(
    editRow?.storeId?._id || editRow?.storeId || stores[0]?._id || ''
  );
  const [appointmentDate, setAppointmentDate] = useState(() => {
    if (editRow?.appointmentDate) {
      return new Date(editRow.appointmentDate).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState(
    editRow?.appointmentTime || '11:00 AM'
  );

  // Status
  const [status, setStatus] = useState(editRow?.status || 'pending');

  const handleServiceChange = (id) => {
    setSelectedServiceId(id);
    const found = services.find((s) => s._id === id);
    if (found) {
      setCustomRepairTitle(found.title);
      setRepairPrice(found.price || 49);
    }
  };

  const handleModelChange = (id) => {
    setDeviceModelId(id);
    const found = models.find((m) => m._id === id);
    if (found && !deviceName) {
      setDeviceName(found.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!firstName.trim()) {
      setFormError('Customer First Name is required.');
      return;
    }
    if (!email.trim() || !phone.trim()) {
      setFormError('Customer Email and Phone Number are required.');
      return;
    }
    if (!deviceName.trim() && !deviceModelId) {
      setFormError('Device Name or Model is required.');
      return;
    }

    const payload = {
      method,
      deviceName: deviceName.trim(),
      deviceModelId: deviceModelId || null,
      repairServiceIds: selectedServiceId ? [selectedServiceId] : [],
      repairTitle: customRepairTitle || 'Device Diagnostics & Inspection',
      repairPrice: parseFloat(repairPrice) || 0,
      storeId: storeId || null,
      appointmentDate: method === 'visit-us' ? appointmentDate : null,
      appointmentTime: method === 'visit-us' ? appointmentTime : null,
      status,
      total: parseFloat(repairPrice) || 0,
      customer: {
        firstName: firstName.trim(),
        lastName: lastName.trim() || firstName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        postcode: postcode.trim(),
        devicePasscode: devicePasscode.trim(),
        mobileNetwork: mobileNetwork.trim(),
        additionalInfo: additionalInfo.trim(),
      },
    };

    try {
      if (isEdit) {
        await resource.update(editRow._id, payload);
      } else {
        await resource.create(payload);
      }
      closeForm();
      resource.fetchAll();
    } catch (err) {
      setFormError(err.message || 'Failed to save booking. Please check the inputs.');
    }
  };

  return (
    <div className="mb-8 bg-white border border-[#b8370e]/20 rounded-2xl shadow-xl overflow-hidden transition-all">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-[#b8370e]/10 via-amber-500/5 to-transparent border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#b8370e] text-white flex items-center justify-center font-black shadow-sm">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F1B2E]">
              {isEdit ? `Edit Booking — ${editRow?.bookingNumber || editRow?._id?.slice(-6)}` : 'Create Manual Repair Booking'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Enter customer repair details, device hardware info, and schedule
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeForm}
          className="text-gray-400 hover:text-gray-600 text-xl font-light cursor-pointer"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {formError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs font-semibold">
            {formError}
          </div>
        )}

        {/* 1. Customer Information */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#b8370e]" /> 1. Customer Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07123 456789"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Device & Repair Problem */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[#b8370e]" /> 2. Device & Repair Specification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Device Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g. iPhone 13 Pro Max"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Catalog Device Model (Optional)
              </label>
              <select
                value={deviceModelId}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
              >
                <option value="">— Select Catalog Model —</option>
                {models.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Catalog Repair Service
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
              >
                <option value="">— Select Preset Service —</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title} (£{s.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Specific Issue / Repair Title
              </label>
              <input
                type="text"
                value={customRepairTitle}
                onChange={(e) => setCustomRepairTitle(e.target.value)}
                placeholder="e.g. Front Screen Replacement & Battery Diagnostic"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Estimated Price (£)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={repairPrice}
                onChange={(e) => setRepairPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-[#b8370e] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Appointment, Store & Status */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#b8370e]" /> 3. Fulfillment, Store & Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Booking Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none"
              >
                {METHOD_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {method === 'visit-us' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                    Appointment Time Slot
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                  Customer Postcode
                </label>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="e.g. SW1A 1AA"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white text-[#b8370e] focus:outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Diagnostics & Notes */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#b8370e]" /> 4. Diagnostics & Customer Notes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Device Lock / Passcode (for testing)
              </label>
              <input
                type="text"
                value={devicePasscode}
                onChange={(e) => setDevicePasscode(e.target.value)}
                placeholder="e.g. 1234 or None"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Mobile Network Provider
              </label>
              <input
                type="text"
                value={mobileNetwork}
                onChange={(e) => setMobileNetwork(e.target.value)}
                placeholder="e.g. O2 / Vodafone / EE / Unlocked"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Additional Instructions / Technician Notes
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={2}
                placeholder="Customer stated phone was dropped in water or screen flickers green..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={closeForm}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#b8370e] hover:bg-[#962d0b] disabled:opacity-60 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {saving ? 'Saving Booking…' : isEdit ? 'Update Booking' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};
>>>>>>> 8f997a0 (Fix frontend tracking)

export default BookingsPage;
