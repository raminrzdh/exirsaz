'use client';

import { useActionState, useEffect } from 'react';
import { submitCommentAction } from '@/app/(storefront)/blog/[slug]/actions';
import { Button } from '@/components/ui/button';

interface BlogCommentFormProps {
  postId: string;
}

export function BlogCommentForm({ postId }: BlogCommentFormProps) {
  const [state, formAction, isPending] = useActionState(submitCommentAction, null);

  // Optionally, you can add a toast or alert when successful.
  // Here we just rely on the inline success message.

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-10">
      <h4 className="font-bold text-slate-900 mb-4">دیدگاه خود را بنویسید</h4>
      
      {state?.success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 mb-4">
          {state.message}
        </div>
      )}

      {state?.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-4">
          {state.error}
        </div>
      )}

      {!state?.success && (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="postId" value={postId} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="authorName" 
              placeholder="نام شما" 
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="ایمیل (اختیاری)" 
              className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-left dir-ltr" 
            />
          </div>
          <textarea 
            name="content"
            placeholder="متن دیدگاه..." 
            rows={4} 
            required
            className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          ></textarea>
          
          <Button 
            type="submit" 
            className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            disabled={isPending}
          >
            {isPending ? 'در حال ثبت...' : 'ثبت دیدگاه'}
          </Button>
          <p className="text-xs text-slate-500 mt-2">نظرات پس از تایید مدیریت نمایش داده می‌شوند.</p>
        </form>
      )}
    </div>
  );
}
