import React from 'react'
import LayoutAdmin from '~/components/admin/layout/LayoutAdmin'
import { AppSidebar } from '~/components/admin/layout/sidebar-layout/AppSidebar'
import { SidebarProvider } from '~/components/admin/layout/sidebar-layout/Sidebar'

import { SearchProvider } from '~/providers/search-context'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='min-h-screen'>
      <SearchProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className='p-2 w-full min-h-full'>
            <LayoutAdmin>{children}</LayoutAdmin>
          </div>
        </SidebarProvider>
      </SearchProvider>
    </div>
  )
}

export default Layout
