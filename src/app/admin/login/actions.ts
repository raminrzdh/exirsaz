'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'

import fs from 'fs'

export async function loginWithPasswordAction(formData: FormData) {
  const phoneRaw = formData.get('phone') as string
  const passwordRaw = formData.get('password') as string
  
  const phone = (phoneRaw || '').trim()
  const password = (passwordRaw || '').trim()

  fs.writeFileSync('debug-login.txt', `Phone Received: '${phone}', Password Received: '${password}'\n`, { flag: 'a' })

  if (!phone || !password) {
    return { error: 'شماره موبایل و رمز عبور الزامی است' }
  }

  console.log('Login attempt for phone:', phone)

  const user = await prisma.user.findUnique({
    where: { phoneNumber: phone },
  })

  if (!user || !user.password) {
    console.log('Login failed: User not found or no password')
    return { error: 'شماره موبایل یا رمز عبور اشتباه است' }
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    console.log('Login failed: Invalid password')
    return { error: 'شماره موبایل یا رمز عبور اشتباه است' }
  }

  console.log('Login successful, setting cookie and redirecting...')

  // Set auth cookie
  ;(await cookies()).set('admin_auth_session', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  return { success: true }
}

export async function requestOtpAction(formData: FormData) {
  const phone = formData.get('phone') as string

  if (!phone) {
    return { error: 'شماره موبایل الزامی است' }
  }

  const user = await prisma.user.findUnique({
    where: { phoneNumber: phone },
  })

  if (!user) {
    // For security, don't reveal if user exists or not immediately in a generic way,
    // but in admin panel we can just return error
    return { error: 'کاربری با این شماره یافت نشد' }
  }

  // Generate a random 5-digit OTP
  const otpCode = Math.floor(10000 + Math.random() * 90000).toString()
  // Set expiration to 5 minutes from now
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000)

  await prisma.user.update({
    where: { phoneNumber: phone },
    data: {
      otpCode,
      otpExpiresAt,
    },
  })

  // Simulated SMS Send - In real app, call your SMS gateway here
  console.log(`[SIMULATED SMS] Send to ${phone}: Your OTP code is ${otpCode}`)

  return { success: true, message: 'کد تایید ارسال شد' }
}

export async function verifyOtpAction(formData: FormData) {
  const phone = formData.get('phone') as string
  const code = formData.get('code') as string

  if (!phone || !code) {
    return { error: 'شماره موبایل و کد تایید الزامی است' }
  }

  const user = await prisma.user.findUnique({
    where: { phoneNumber: phone },
  })

  if (!user || !user.otpCode || !user.otpExpiresAt) {
    return { error: 'کد تایید نامعتبر است' }
  }

  if (new Date() > user.otpExpiresAt) {
    return { error: 'کد تایید منقضی شده است' }
  }

  if (user.otpCode !== code) {
    return { error: 'کد تایید اشتباه است' }
  }

  // Clear OTP fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpCode: null,
      otpExpiresAt: null,
    },
  })

  // Set auth cookie
  ;(await cookies()).set('admin_auth_session', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  return { success: true }
}

export async function logoutAction() {
  ;(await cookies()).delete('admin_auth_session')
  return { success: true }
}
