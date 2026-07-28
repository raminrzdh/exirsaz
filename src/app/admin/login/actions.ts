'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  // Hardcoded for now based on user request
  if (username === 'admin' && password === 'admin') {
    (await cookies()).set('admin_auth_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    
    redirect('/admin')
  } else {
    return { error: 'نام کاربری یا رمز عبور اشتباه است' }
  }
}

export async function logoutAction() {
  (await cookies()).delete('admin_auth_session')
  redirect('/admin/login')
}
