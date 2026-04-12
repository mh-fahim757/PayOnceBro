import React from 'react'
import { Outlet } from 'react-router-dom'
import TopNavbar from '../components/common/TopNavbar'

const navLinks = [
  { to: '/admin/analytics', label: 'Analytics' },
]

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar title="PayOnceBro Admin" links={navLinks} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
