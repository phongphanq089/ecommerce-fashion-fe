import React from 'react'
import LayoutAdmin from '~/components/layouts/AdminLayout'
import { AppSidebar } from '~/components/layouts/AdminLayout/Sidebar/AppSidebar'
import { SidebarProvider } from '~/components/layouts/AdminLayout/Sidebar/Sidebar'
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
