'use client'

import { useState, useTransition } from 'react'
import { loginWithPasswordAction, requestOtpAction, verifyOtpAction } from './actions'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'
import { extractDigits } from '@/lib/utils/currency'
import { useRouter } from 'next/navigation'

type LoginMethod = 'password' | 'otp'
type LoginStep = 'phone' | 'credentials'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const [step, setStep] = useState<LoginStep>('phone')
  const [method, setMethod] = useState<LoginMethod>('password')
  const [phone, setPhone] = useState('')

  // Move to step 2 (credentials)
  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!phone || phone.length < 10) {
      setError('شماره موبایل نامعتبر است')
      return
    }
    setError(null)
    setStep('credentials')
  }

  // Handle password login
  function handlePasswordSubmit(formData: FormData) {
    formData.append('phone', phone)
    startTransition(async () => {
      setError(null)
      const res = await loginWithPasswordAction(formData)
      if (res?.error) {
        setError(res.error)
      } else if (res?.success) {
        router.push('/admin')
      }
    })
  }

  // Request OTP
  function handleRequestOtp() {
    startTransition(async () => {
      setError(null)
      const formData = new FormData()
      formData.append('phone', phone)
      const res = await requestOtpAction(formData)
      if (res?.error) {
        setError(res.error)
      } else if (res?.success) {
        setSuccessMsg(res.message || 'کد ارسال شد')
        setMethod('otp')
      }
    })
  }

  // Handle OTP Verify
  function handleOtpSubmit(formData: FormData) {
    formData.append('phone', phone)
    startTransition(async () => {
      setError(null)
      const res = await verifyOtpAction(formData)
      if (res?.error) {
        setError(res.error)
      } else if (res?.success) {
        router.push('/admin')
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl shadow-indigo-100/20 border border-slate-100 dark:border-gray-700">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            اکسیرساز
          </h1>
          <h2 className="text-center text-lg font-bold text-slate-700 dark:text-slate-300">
            ورود به مدیریت
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-gray-400">
            {step === 'phone' ? 'شماره موبایل خود را وارد کنید' : `ورود برای ${phone}`}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm text-center border border-green-100 dark:border-green-800">
            {successMsg}
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="phone">
                شماره موبایل
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(extractDigits(e.target.value))}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left dir-ltr"
                placeholder="09123456789"
              />
            </div>
            <Button type="submit" className="w-full">
              تایید و ادامه
            </Button>
          </form>
        )}

        {step === 'credentials' && method === 'password' && (
          <form action={handlePasswordSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                رمز عبور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left dir-ltr"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'در حال ورود...' : 'ورود با رمز عبور'}
              </Button>
              <Button type="button" variant="outline" className="w-full" disabled={isPending} onClick={handleRequestOtp}>
                ورود با کد یکبار مصرف (OTP)
              </Button>
              <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => setStep('phone')}>
                تغییر شماره موبایل
              </Button>
            </div>
          </form>
        )}

        {step === 'credentials' && method === 'otp' && (
          <form action={handleOtpSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="code">
                کد تایید پیامک شده
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center tracking-widest text-lg"
                placeholder="12345"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'در حال بررسی...' : 'تایید کد و ورود'}
              </Button>
              <Button type="button" variant="outline" className="w-full" disabled={isPending} onClick={() => { setMethod('password'); setSuccessMsg(null); setError(null); }}>
                ورود با رمز عبور
              </Button>
              <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => setStep('phone')}>
                تغییر شماره موبایل
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
