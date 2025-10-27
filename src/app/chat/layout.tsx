import SideNavbar from '@/components/chat/sideNavbar';
import React from 'react'

const chatlayout = ({children}:{
  children: React.ReactNode;
}) => {
  return (
    <div className='grid grid-cols-1'>
        <SideNavbar/>
       
            {children}
       
    </div>
  )
}

export default chatlayout