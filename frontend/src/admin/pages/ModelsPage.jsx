import React, { useEffect, useState } from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import TableImage from '../components/TableImage';
import { deviceModelApi, fetchAllBrands, fetchAllDeviceTypes } from '../services/adminApi';

/* ─── Status badge helper ─── */
const StatusBadge = ({ active }) =>
  active ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
      Inactive
    </span>
  );

/* ─── Predefined Model Groups ─── */
const SAMSUNG_GROUPS = [
  'Galaxy Flip & Fold series',
  'Galaxy S series',
  'Galaxy Note series',
  'Select device',
  'Galaxy A series',
];

const TABLET_GROUPS = [
  'iPad',
  'iPad Air',
  'iPad Mini',
  'iPad Pro',
];

const APPLE_LAPTOP_GROUPS = [
  'Apple MacBook',
  'MacBook Pro',
  'MacBook Air',
];

const COLUMNS = [
  {
    key: 'image',
    label: 'Image',
    render: (r) => <TableImage src={r.image} alt={r.name} />,
  },
  {
    key: 'name',
    label: 'Model',
    render: (r) => (
      <div>
        <p className="font-semibold text-[#1F1B2E] text-sm">{r.name}</p>
        <p className="text-xs font-mono text-gray-400 mt-0.5">{r.slug}</p>
      </div>
    ),
  },
  {
    key: 'brandId',
    label: 'Brand',
    render: (r) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-100">
        {r.brandId?.name ?? r.brandId ?? '—'}
      </span>
    ),
  },
  {
    key: 'deviceTypeId',
    label: 'Type',
    render: (r) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
        {r.deviceTypeId?.title ?? r.deviceTypeId ?? '—'}
      </span>
    ),
  },
  {
    key: 'categoryGroup',
    label: 'Group',
    render: (r) =>
      r.categoryGroup ? (
        <span className="text-xs text-gray-600 font-medium">{r.categoryGroup}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: 'modelNumber',
    label: 'Model No.',
    render: (r) =>
      r.modelNumber ? (
        <span className="text-xs font-mono text-gray-500">{r.modelNumber}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: 'year',
    label: 'Year',
    render: (r) => <span className="text-xs text-gray-500">{r.year || '—'}</span>,
  },
  {
    key: 'sortOrder',
    label: 'Order',
    render: (r) => (
      <span className="text-xs text-gray-500 font-mono">{r.sortOrder ?? 0}</span>
    ),
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (r) => <StatusBadge active={r.isActive} />,
  },
];

const ModelsPage = () => {
  const resource = useAdminResource(deviceModelApi);
  const [brandOptions, setBrandOptions]           = useState([]);
  const [deviceTypeOptions, setDeviceTypeOptions] = useState([]);

  useEffect(() => {
    fetchAllBrands()
      .then((res) => {
        const list = res?.items ?? res ?? [];
        setBrandOptions(
          list.map((b) => ({
            value: b._id,
            label: b.name,
            slug: b.slug,
          }))
        );
      })
      .catch(() => {});

    fetchAllDeviceTypes()
      .then((res) => {
        const list = res?.items ?? res ?? [];
        setDeviceTypeOptions(
          list.map((dt) => ({
            value: dt._id,
            label: dt.title,
          }))
        );
      })
      .catch(() => {});
  }, []);

  // Form fields dynamically computed based on currently selected values
  const getFormFields = (vals = {}) => {
    const selectedBrandId = vals.brandId?._id ?? vals.brandId;
    const selectedBrand = brandOptions.find(
      (b) => String(b.value) === String(selectedBrandId)
    );

    const selectedDeviceTypeId = vals.deviceTypeId?._id ?? vals.deviceTypeId;
    const selectedDeviceType = deviceTypeOptions.find(
      (dt) => String(dt.value) === String(selectedDeviceTypeId)
    );

    const selectedDeviceTypeLabel =
      selectedDeviceType?.label ??
      vals.deviceTypeId?.title ??
      vals.deviceTypeId?.name ??
      '';

    const isTabletDevice = String(selectedDeviceTypeLabel).trim().toLowerCase().includes('tablet');
    const isLaptopDevice = String(selectedDeviceTypeLabel).trim().toLowerCase().includes('laptop');

    const isAppleBrand = Boolean(
      (selectedBrand &&
        (selectedBrand.slug?.toLowerCase() === 'apple' ||
          selectedBrand.label?.toLowerCase().includes('apple'))) ||
      (vals.brandId?.name &&
        vals.brandId.name.toLowerCase().includes('apple')) ||
      (vals.brandId?.slug &&
        vals.brandId.slug.toLowerCase().includes('apple'))
    );

    const isSamsung = Boolean(
      (selectedBrand &&
        (selectedBrand.slug?.toLowerCase() === 'samsung' ||
          selectedBrand.label?.toLowerCase().includes('samsung'))) ||
      (vals.brandId?.name &&
        vals.brandId.name.toLowerCase().includes('samsung')) ||
      (vals.brandId?.slug &&
        vals.brandId.slug.toLowerCase().includes('samsung'))
    );

    const samsungOptions = SAMSUNG_GROUPS.map((g) => ({
      value: g,
      label: g,
    }));

    const tabletOptions = TABLET_GROUPS.map((g) => ({
      value: g,
      label: g,
    }));

    const appleLaptopOptions = APPLE_LAPTOP_GROUPS.map((g) => ({
      value: g,
      label: g,
    }));

    // If an existing record has a custom group, keep it selectable
    if (
      vals.categoryGroup &&
      vals.categoryGroup !== '__custom__' &&
      !SAMSUNG_GROUPS.includes(vals.categoryGroup)
    ) {
      samsungOptions.push({
        value: vals.categoryGroup,
        label: vals.categoryGroup,
      });
    }

    if (
      vals.categoryGroup &&
      vals.categoryGroup !== '__custom__' &&
      !TABLET_GROUPS.includes(vals.categoryGroup)
    ) {
      tabletOptions.push({
        value: vals.categoryGroup,
        label: vals.categoryGroup,
      });
    }

    if (
      vals.categoryGroup &&
      vals.categoryGroup !== '__custom__' &&
      !APPLE_LAPTOP_GROUPS.includes(vals.categoryGroup)
    ) {
      appleLaptopOptions.push({
        value: vals.categoryGroup,
        label: vals.categoryGroup,
      });
    }

    const categoryGroupField = isLaptopDevice && isAppleBrand
      ? {
          name: 'categoryGroup',
          label: 'Group',
          type: 'select',
          options: appleLaptopOptions,
          allowCustom: true,
          customName: 'categoryGroupCustom',
          customPlaceholder: 'Or enter custom MacBook group…',
          hint: 'Predefined groups for Apple MacBook models',
        }
      : isTabletDevice
        ? {
            name: 'categoryGroup',
            label: 'Group',
            type: 'select',
            options: tabletOptions,
            allowCustom: true,
            customName: 'categoryGroupCustom',
            customPlaceholder: 'Or enter custom tablet group…',
            hint: 'Predefined groups for iPad models',
          }
        : isSamsung
          ? {
              name: 'categoryGroup',
              label: 'Group',
              type: 'select',
              options: samsungOptions,
              allowCustom: true,
              customName: 'categoryGroupCustom',
              customPlaceholder: 'Or enter custom Samsung series…',
              hint: 'Predefined groups for Samsung models',
            }
          : {
              name: 'categoryGroup',
              label: 'Group',
              placeholder: 'e.g. iPhone 17 Series',
              hint: 'Device series or family group',
            };

    return [
      {
        name: 'name',
        label: 'Model Name',
        required: true,
        placeholder: isSamsung ? 'e.g. Galaxy S25 Ultra' : isTabletDevice ? 'e.g. iPad Pro 13-inch' : isLaptopDevice && isAppleBrand ? 'e.g. MacBook Pro 14-inch' : 'e.g. iPhone 17 Pro Max',
      },
      { name: 'slug', label: 'Slug', hint: 'Auto-generated if empty' },
      {
        name: 'brandId',
        label: 'Brand',
        type: 'select',
        required: true,
        options: brandOptions,
        formatValue: (v) => v?._id ?? v ?? '',
      },
      {
        name: 'deviceTypeId',
        label: 'Device Type',
        type: 'select',
        required: true,
        options: deviceTypeOptions,
        formatValue: (v) => v?._id ?? v ?? '',
      },
      categoryGroupField,
      {
        name: 'modelNumber',
        label: 'Model Number',
        placeholder: isSamsung ? 'e.g. SM-S938B' : isTabletDevice ? 'e.g. A2899' : isLaptopDevice && isAppleBrand ? 'e.g. MJLQ3HN/A' : 'e.g. A3293',
      },
      { name: 'year', label: 'Year', placeholder: '2025' },
      { name: 'sortOrder', label: 'Sort Order', type: 'number', placeholder: '0' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'image', label: 'Image', type: 'file' },
    ];
  };

  const buildPayload = (vals) => {
    const fd = new FormData();
    const resolvedGroup =
      vals.categoryGroup === '__custom__'
        ? (vals.categoryGroupCustom || '').trim()
        : (vals.categoryGroup || '').trim();

    Object.entries(vals).forEach(([k, v]) => {
      if (k === 'categoryGroup') {
        fd.append('categoryGroup', resolvedGroup);
      } else if (k === 'categoryGroupCustom') {
        // internal field, omit
      } else if (k === 'image') {
        if (v instanceof File) fd.append('image', v);
      } else {
        fd.append(k, v === true ? 'true' : v === false ? 'false' : v ?? '');
      }
    });
    return fd;
  };

  return (
    <AdminLivePage
      title="Device Models"
      subtitle="Models linked to brands and available repair services"
      actionLabel="Add Model"
      columns={COLUMNS}
      searchKeys={['name', 'slug', 'categoryGroup', 'modelNumber', 'year']}
      searchPlaceholder="Search models…"
      resource={resource}
      formFields={getFormFields}
      buildPayload={buildPayload}
    />
  );
};

export default ModelsPage;
