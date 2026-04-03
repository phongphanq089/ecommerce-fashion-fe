import {
  IconBellDollar,
  IconBrandAdobe,
  IconBrowserCheck,
  IconCategory,
  IconImageInPicture,
  IconLayoutDashboard,
  IconNotification,
  IconPackages,
  IconRefreshDot,
  IconSettings,
  IconShoppingBag,
  IconTicket,
  IconUser,
  IconUserCog,
  IconUserEdit,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { SidebarData } from './types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'Admin',
      items: [
        {
          title: 'Dashboard',
          url: '/admin/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Products',
          icon: IconShoppingBag,
          items: [
            {
              title: 'Product List',
              url: '/admin/product/list',
            },
            {
              title: 'Create Product',
              url: '/admin/product/create',
            },
          ],
        },
        {
          title: 'Colections',
          icon: IconCategory,
          url: '/admin/collection',
        },
        {
          title: 'Categories',
          icon: IconPackages,
          url: '/admin/category',
        },
        {
          title: 'Brands',
          icon: IconBrandAdobe,
          url: '/admin/brand',
        },
        {
          title: 'Custommers',
          url: '/customer',
          badge: '3',
          icon: IconUser,
        },
        {
          title: 'Refunds',

          icon: IconRefreshDot,
          items: [
            {
              title: 'Refund request',
              url: '/admin/refund-request',
            },
            {
              title: 'Refund setting',
              url: '/admin/refund-setting',
            },
          ],
        },
      ],
    },
    {
      title: 'Vendor',
      items: [
        {
          title: 'Earnings',
          icon: IconBellDollar,
          items: [
            {
              title: 'Earning History',
              url: '/admin/eearning-history',
            },
            {
              title: 'Payouts',
              url: '/admin/payouts',
            },
            {
              title: 'Payout Requests',
              url: '/admin/payout-requests',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
          ],
        },
        {
          title: 'Support Tickets',
          url: '/admin/support-tickets',
          icon: IconTicket,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account Setting',
              url: '/admin/aacount-setting',
              icon: IconUserEdit,
            },
            {
              title: 'Shop Settings',
              url: '/admin/shop-settings',
              icon: IconSettings,
            },
            {
              title: 'Notifications',
              url: '/admin/shop-settings',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/admin/shop-settings',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Media',
          icon: IconImageInPicture,
          url: '/admin/media',
        },
      ],
    },
    {
      title: 'security',
      items: [
        {
          title: 'Logs',
          icon: IconSettings,
          url: '/admin/log',
        },
      ],
    },
  ],
}
