import SideNavbar from '@/components/chat/sideNavbar';
import React from 'react'

const chatlayout = ({children}:{
  children: React.ReactNode;
}) => {
  return (
    <div className='flex'>
        <SideNavbar/>
        <main className='flex-1'>
            {children}
        </main>
        
    </div>
  )
}

export default chatlayout