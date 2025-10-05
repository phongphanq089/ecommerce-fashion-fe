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
          <LayoutAdmin>{children}</LayoutAdmin>
        </SidebarProvider>
      </SearchProvider>
    </div>
  )
}

export default Layout
