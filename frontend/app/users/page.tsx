"use client"

import { MainAppLayout } from "@/components/layout/main-app-layout"
import UserManagement from "@/components/users/user-management"

export default function UsersPage() {
  return (
    <MainAppLayout title="User Management" description="Manage users, roles and permissions">
      <UserManagement />
    </MainAppLayout>
  )
}
