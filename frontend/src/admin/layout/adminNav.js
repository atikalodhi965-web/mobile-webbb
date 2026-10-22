import {
  LayoutDashboard,
  Smartphone,
  Tags,
  Cpu,
  Wrench,
  ListTree,
  ShoppingBag,
  CalendarCheck,
  Package,
  CreditCard,

  TicketPercent,
  Star,
  HelpCircle,
  FileText,
  Image,
  Shield,
  Users,
  Images,
} from 'lucide-react';

export const adminNavSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Device Types', path: '/admin/device-types', icon: Smartphone },
      { label: 'Brands', path: '/admin/brands', icon: Tags },
      { label: 'Device Models', path: '/admin/models', icon: Cpu },
    ],
  },
  {
    title: 'Repairs',
    items: [
      { label: 'Repair Categories', path: '/admin/repair-categories', icon: ListTree },
      { label: 'Repair Services', path: '/admin/repair-services', icon: Wrench },
    ],
  },
  {
    title: 'E-commerce',
    items: [
      { label: 'Refurbished Products', path: '/admin/products', icon: ShoppingBag },
      { label: 'Orders', path: '/admin/orders', icon: Package },
      { label: 'Payments', path: '/admin/payments', icon: CreditCard },
      { label: 'Discounts', path: '/admin/discounts', icon: TicketPercent },
    ],
  },
  {
    title: 'Bookings',
    items: [
      { label: 'Repair Bookings', path: '/admin/bookings', icon: CalendarCheck },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'CMS Pages', path: '/admin/cms-pages', icon: FileText },
      { label: 'Hero Slides', path: '/admin/hero-slides', icon: Image },
      { label: 'Reviews', path: '/admin/reviews', icon: Star },
      { label: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
      { label: 'Protection Plan', path: '/admin/protection', icon: Shield },
      { label: 'Media Library', path: '/admin/media', icon: Images },
    ],
  },
  {
    title: 'Users',
    items: [
      { label: 'Customers & Staff', path: '/admin/users', icon: Users },
    ],
  },
];
