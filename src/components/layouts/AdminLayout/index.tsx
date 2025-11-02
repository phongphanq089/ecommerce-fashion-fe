import React from 'react'
import { Header } from '../../layouts/AdminLayout/Header/Header'
import { SearchBar } from '../../layouts/AdminLayout/Header/SearchBar'
import ThemeToggle from '../../layouts/AdminLayout/Header/ThemeToggle'
import { ProfileDropdown } from '../../layouts/AdminLayout/Header/ProfileDropdown'
import { MainContent } from './MainContent'

const LayoutAdmin = ({ children }: { children: React.ReactNode }) => {
  return (
    // overflow-hidden
    <div className='w-full p-2'>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'></div>{' '}
        <SearchBar />
        <ThemeToggle />
        <ProfileDropdown />
      </Header>
      <MainContent fixed className='min-h-screen'>
        {children}
      </MainContent>
    </div>
  )
}

export default LayoutAdmin
