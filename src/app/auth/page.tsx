import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Login } from '@/components/auth/Login'

const AUTH:React.FC = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
   <Login/>
    </div>
  )
}

export default AUTH