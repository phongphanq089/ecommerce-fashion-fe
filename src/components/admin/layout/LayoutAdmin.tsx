import React from 'react'
import { Header } from './header-top/Header'
import { SearchBar } from './header-top/SearchBar'
import ThemeToggle from './header-top/ThemeToggle'
import { ProfileDropdown } from './header-top/ProfileDropdown'
import { MainContent } from './MainContent'

const LayoutAdmin = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full p-2 overflow-hidden'>
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
