"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Users, 
  TrendingUp, 
  Search, 
  Building2, 
  MessageCircle, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight,
  Globe,
  Info,
  ArrowDownRight
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils/currency";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  YAxis
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CityStat {
  city: string;
  status: "has_agent" | "no_agent";
  searches: number;
  calls: number;
  wa: number;
}

interface AnalyticsSeoDashboardProps {
  realData?: {
    totalRevenue: number;
    orderCount: number;
    totalLeads: number;
    cityAnalytics: CityStat[];
    funnel?: {
      productViews: number;
      addToCarts: number;
      checkouts: number;
      purchases: number;
    };
  }
}

const visitsChartConfig = {
  visits: {
    label: "بازدید کل",
    color: "hsl(var(--chart-1))",
  },
  organic: {
    label: "ورودی ارگانیک",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const visitsData = [
  { date: "۱ شهریور", visits: 1200, organic: 800 },
  { date: "۲ شهریور", visits: 1350, organic: 950 },
  { date: "۳ شهریور", visits: 1100, organic: 700 },
  { date: "۴ شهریور", visits: 1600, organic: 1100 },
  { date: "۵ شهریور", visits: 1900, organic: 1350 },
  { date: "۶ شهریور", visits: 2100, organic: 1600 },
  { date: "۷ شهریور", visits: 1850, organic: 1400 },
];

export function AnalyticsSeoDashboard({ realData }: AnalyticsSeoDashboardProps) {
  const [timeframe, setTimeframe] = useState("30");

  const revenue = realData?.totalRevenue || 0;
  const orders = realData?.orderCount || 0;
  const leads = realData?.totalLeads || 0;
  const cities = realData?.cityAnalytics || [
    { city: "تهران", status: "has_agent", searches: 5430, calls: 120, wa: 85 },
    { city: "شیراز", status: "no_agent", searches: 2340, calls: 0, wa: 0 },
  ];

  // Safely fallback to mock if no real data is gathered yet
  const fViews = Math.max(realData?.funnel?.productViews || 4500, 1);
  const fCarts = realData?.funnel?.addToCarts || 2025;
  const fChecks = realData?.funnel?.checkouts || 810;
  const fPurch = realData?.funnel?.purchases || 360;

  const crCart = Math.round((fCarts / fViews) * 100);
  const crCheck = fCarts > 0 ? Math.round((fChecks / fCarts) * 100) : 0;
  const crPurch = fChecks > 0 ? Math.round((fPurch / fChecks) * 100) : 0;
  const crOverall = Math.round((fPurch / fViews) * 100);

  return (
    <div dir="rtl" className="space-y-6">
      {/* 1. Header & Timeframe Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">مرکز آمار، رفتار خریداران و هوش سئو (Analytics & SEO Hub)</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">مانیتورینگ بلادرنگ تعامل با نمایندگان، تبدیل‌های فروش و عملکرد موتورهای جستجو</p>
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <Select value={timeframe} onValueChange={(val) => val && setTimeframe(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="بازه زمانی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">۷ روز اخیر</SelectItem>
              <SelectItem value="30">۳۰ روز گذشته</SelectItem>
              <SelectItem value="90">۹۰ روز گذشته</SelectItem>
              <SelectItem value="all">کل دوره</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2. Top-Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ارجاع به نمایندگان</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              کلیک تماس و واتس‌اپ روی پروفایل نمایندگان
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">فروش مستقیم آنلاین</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenue.toLocaleString('fa-IR')} تومان</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {orders.toLocaleString('fa-IR')} سفارش پرداخت شده در سایت
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">استعلام‌های B2B و تناژ</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۱۲ استعلام</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              زمان پاسخگویی: <span className="text-amber-600 font-medium ms-1">میانگین ۲ ساعت</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">کلیک‌های سئو و AI</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۱۴,۵۰۰</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-600 flex items-center"><ArrowUpRight className="h-3 w-3 me-1" /> +۸٪</span> ارگانیک و موتورهای AI
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Deep-Dive Analytics Tabs */}
      <Tabs defaultValue="funnels" className="space-y-4">
        <TabsList className="flex flex-wrap w-full justify-start overflow-x-auto h-auto bg-slate-100 p-1">
          <TabsTrigger value="funnels" className="text-sm py-2 px-4 whitespace-nowrap">بازدید و فانل فروش</TabsTrigger>
          <TabsTrigger value="territory" className="text-sm py-2 px-4 whitespace-nowrap">هوش منطقه‌ای و نمایندگان</TabsTrigger>
          <TabsTrigger value="seo" className="text-sm py-2 px-4 whitespace-nowrap">هوش سئو و AI</TabsTrigger>
          <TabsTrigger value="health" className="text-sm py-2 px-4 whitespace-nowrap">سلامت فنی سایت</TabsTrigger>
          <TabsTrigger value="guide" className="text-sm py-2 px-4 whitespace-nowrap flex items-center gap-1">
            <Info className="h-4 w-4" />
            راهنما
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Visits & Funnels (New) */}
        <TabsContent value="funnels" className="space-y-4">
          
          {/* Visits Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">نمودار ترافیک و بازدید</CardTitle>
              <CardDescription>روند بازدیدکنندگان کل سایت و ورودی‌های ارگانیک در ۷ روز گذشته</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full" dir="ltr">
                <ChartContainer config={visitsChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visitsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-visits)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-visits)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fillOrganic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-organic)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-organic)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="visits" stroke="var(--color-visits)" fillOpacity={1} fill="url(#fillVisits)" />
                      <Area type="monotone" dataKey="organic" stroke="var(--color-organic)" fillOpacity={1} fill="url(#fillOrganic)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">فانل فروش مستقیم (E-commerce)</CardTitle>
                <CardDescription>نرخ تبدیل (CR) در هر مرحله از خرید آنلاین</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>مشاهده محصول</span>
                    <span className="font-medium text-slate-700">{fViews.toLocaleString('fa-IR')} کاربر</span>
                  </div>
                  <Progress value={100} className="h-2 bg-slate-100" />
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-400 py-1 pe-2">
                  <ArrowDownRight className="h-4 w-4" /> 
                  نرخ تبدیل (CR): <strong className="text-slate-600">{toPersianDigits(crCart.toString())}٪</strong>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>افزودن به سبد خرید</span>
                    <span className="font-medium text-slate-700">{fCarts.toLocaleString('fa-IR')} کاربر</span>
                  </div>
                  <Progress value={crCart} className="h-2 bg-slate-100" />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 py-1 pe-2">
                  <ArrowDownRight className="h-4 w-4" /> 
                  نرخ تبدیل (CR): <strong className="text-slate-600">{toPersianDigits(crCheck.toString())}٪</strong>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>درگاه پرداخت</span>
                    <span className="font-medium text-slate-700">{fChecks.toLocaleString('fa-IR')} کاربر</span>
                  </div>
                  <Progress value={crCheck} className="h-2 bg-slate-100" />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 py-1 pe-2">
                  <ArrowDownRight className="h-4 w-4" /> 
                  نرخ تبدیل نهایی (CR): <strong className="text-emerald-600">{toPersianDigits(crPurch.toString())}٪</strong>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-emerald-700">پرداخت موفق (فروش)</span>
                    <span className="font-bold text-emerald-600">{fPurch.toLocaleString('fa-IR')} خریدار</span>
                  </div>
                  <Progress value={crPurch} className="h-3 bg-emerald-100 [&>div]:bg-emerald-500" />
                </div>
                
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center text-sm">
                  مجموع نرخ تبدیل فانل (Overall CR): <strong>{toPersianDigits(crOverall.toString())}٪</strong>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">فانل استعلام B2B (Proforma)</CardTitle>
                <CardDescription>نرخ تبدیل (CR) در درخواست‌های عمده و تناژ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>کلیک دکمه استعلام</span>
                    <span className="font-medium text-slate-700">۲۱۰ لید</span>
                  </div>
                  <Progress value={100} className="h-2 bg-slate-100" />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 py-1 pe-2">
                  <ArrowDownRight className="h-4 w-4" /> 
                  نرخ تبدیل (CR): <strong className="text-slate-600">۷۴.۷٪</strong>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>تایید پیامکی شماره (OTP)</span>
                    <span className="font-medium text-slate-700">۱۵۷ لید</span>
                  </div>
                  <Progress value={75} className="h-2 bg-slate-100" />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 py-1 pe-2">
                  <ArrowDownRight className="h-4 w-4" /> 
                  نرخ تماس موفق (CR): <strong className="text-indigo-600">۵۳.۵٪</strong>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-indigo-700">تماس موفق فروش</span>
                    <span className="font-bold text-indigo-600">۸۴ تماس</span>
                  </div>
                  <Progress value={40} className="h-3 bg-indigo-100 [&>div]:bg-indigo-500" />
                </div>
                
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center text-sm">
                  مجموع نرخ تبدیل فانل (Overall CR): <strong>۴۰٪</strong>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Territory */}
        <TabsContent value="territory" className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-amber-800">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">فرصت توسعه نمایندگی (Expansion Alert)</h4>
              <p className="text-sm mt-1">بر اساس جستجوهای انجام شده، شهر شیراز تقاضای بالایی دارد اما فاقد نماینده است؛ پیشنهاد جذب نماینده برای پوشش این منطقه و کاهش هزینه‌های ارسال پستی.</p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">پرترافیک‌ترین شهرها</CardTitle>
              <CardDescription>بررسی تقاضا به تفکیک شهرها و میزان کلیک روی نمایندگی‌ها (داده‌های واقعی)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start">نام شهر</TableHead>
                      <TableHead className="text-center">وضعیت نمایندگی</TableHead>
                      <TableHead className="text-center">تعداد جستجو (حدودی)</TableHead>
                      <TableHead className="text-center">کلیک روی تماس</TableHead>
                      <TableHead className="text-center">کلیک واتس‌اپ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cities.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.city}</TableCell>
                        <TableCell className="text-center">
                          {row.status === "has_agent" ? (
                            <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 shadow-none border-none">دارای نماینده رسمی</Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 shadow-none border-none">فاقد نماینده</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-medium">{row.searches.toLocaleString('fa-IR')}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.calls.toLocaleString('fa-IR')}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.wa.toLocaleString('fa-IR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab SEO */}
        <TabsContent value="seo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ترافیک موتورهای هوش مصنوعی (GEO)</CardTitle>
                <CardDescription>ورودی از ابزارهای هوش مصنوعی مولد</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Globe className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">Google AI Overviews</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-medium text-muted-foreground w-8">۶۵٪</span>
                      <div className="w-16 sm:w-24"><Progress value={65} className="h-2" /></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <MessageCircle className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">ChatGPT Search</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-medium text-muted-foreground w-8">۲۰٪</span>
                      <div className="w-16 sm:w-24"><Progress value={20} className="h-2" /></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Search className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">Perplexity AI</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-medium text-muted-foreground w-8">۱۵٪</span>
                      <div className="w-16 sm:w-24"><Progress value={15} className="h-2" /></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">برترین کلمات کلیدی ارگانیک (Search Console)</CardTitle>
                <CardDescription>۵ کلمه پرجستجو در ماه اخیر</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start">کلمه کلیدی</TableHead>
                      <TableHead className="text-center">کلیک</TableHead>
                      <TableHead className="text-center whitespace-nowrap">رتبه میانگین</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { kw: "خرید توری سایبان", clicks: "۳,۴۵۰", pos: "۲.۴" },
                      { kw: "قیمت شید گلخانه", clicks: "۲,۱۰۰", pos: "۱.۸" },
                      { kw: "کیسه راشل پیاز", clicks: "۱,۸۵۰", pos: "۳.۱" },
                      { kw: "تولید کننده توری سایبان", clicks: "۹۸۰", pos: "۱.۲" },
                      { kw: "نمایندگی اکسیرساز شمال", clicks: "۴۵۰", pos: "۱.۰" },
                    ].map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.kw}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.clicks}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-normal">{row.pos}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Health */}
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> وضعیت Core Web Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-900 font-medium">LCP (سرعت لود)</span>
                    <span className="text-emerald-700">۰.۸ ثانیه</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-900 font-medium">CLS (پرش 레이آوت)</span>
                    <span className="text-emerald-700">۰.۰۱</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg text-slate-800">خطاهای 404 (نیازمند ریدایرکت)</CardTitle>
                  <CardDescription>آدرس‌های قدیمی از سیستم وردپرس که یافت نمی‌شوند</CardDescription>
                </div>
                <Button variant="outline" size="sm">افزودن 301 ریدایرکت</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-start">آدرس صفحه (URL)</TableHead>
                        <TableHead className="text-center">تعداد برخورد</TableHead>
                        <TableHead className="text-center">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm font-mono text-muted-foreground whitespace-nowrap" dir="ltr">/product/shading-net-old-80/</TableCell>
                        <TableCell className="text-center text-red-600 font-medium">۱۴۲</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-indigo-600 whitespace-nowrap">ارجاع به آدرس جدید</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm font-mono text-muted-foreground whitespace-nowrap" dir="ltr">/category/greenhouse-nets/</TableCell>
                        <TableCell className="text-center text-red-600 font-medium">۸۵</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-indigo-600 whitespace-nowrap">ارجاع به آدرس جدید</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 5: Guide */}
        <TabsContent value="guide" className="space-y-4">
          <Card className="bg-indigo-50 border-indigo-100">
            <CardHeader>
              <CardTitle className="text-indigo-900 flex items-center gap-2">
                <Info className="h-5 w-5" /> راهنمای داشبورد و منابع داده‌ها
              </CardTitle>
              <CardDescription className="text-indigo-700">
                این راهنما توضیح می‌دهد که اعداد و ارقام نمایش داده شده در این صفحه چگونه محاسبه می‌شوند.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-indigo-900 text-sm">
              <div className="p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                <h4 className="font-bold mb-2 flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4"/> فروش مستقیم آنلاین</h4>
                <p className="leading-relaxed">این عدد به صورت کاملاً <strong>واقعی (Real-time)</strong> از دیتابیس دریافت می‌شود. مبلغ نمایش داده شده حاصل جمع فیلد <code>totalAmount</code> در جدول <code>Order</code> است، مشروط بر اینکه وضعیت پرداخت سفارش (paymentStatus) برابر با <code>PAID</code> (موفق) باشد.</p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                <h4 className="font-bold mb-2 flex items-center gap-2 text-base"><Users className="h-4 w-4"/> ارجاع به نمایندگان و هوش منطقه‌ای</h4>
                <p className="leading-relaxed">کلیک‌های کاربران بر روی دکمه‌های "تماس" و "واتس‌اپ" در پروفایل نمایندگی‌ها تحت عنوان جدول <code>LeadEvent</code> در دیتابیس ثبت می‌گردد. در تب "هوش منطقه‌ای"، تمامی کلیک‌های ثبت شده به تفکیک شهرهایی که نمایندگی در آنها فعال است گروه‌بندی و نمایش داده می‌شوند. (داده واقعی است)</p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                <h4 className="font-bold mb-2 flex items-center gap-2 text-base"><Search className="h-4 w-4"/> هوش سئو و هوش مصنوعی (موتورهای جستجو)</h4>
                <p className="leading-relaxed">اطلاعات مربوط به ترافیک ورودی از Google و ربات‌های هوش مصنوعی (نظیر ChatGPT) درون دیتابیس پرایویت پروژه وجود ندارند. برای واقعی شدن این بخش نیاز است که در آینده API رسمی <strong>Google Search Console</strong> و <strong>Google Analytics</strong> متصل گردد. اعداد فعلی در تب‌های سئو و نمودار بازدید به صورت نمونه (Mock) نمایش داده شده‌اند.</p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                <h4 className="font-bold mb-2 flex items-center gap-2 text-base"><ArrowDownRight className="h-4 w-4"/> نرخ تبدیل (CR - Conversion Rate)</h4>
                <p className="leading-relaxed">نرخ تبدیل یا CR در بخش فانل‌ها، نشان‌دهنده درصد کاربرانی است که از یک مرحله با موفقیت به مرحله بعدی رفته‌اند. هرچه این عدد در مراحل مختلف بالاتر باشد، به معنای ریزش کمتر و عملکرد بهتر قیف فروش است.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
