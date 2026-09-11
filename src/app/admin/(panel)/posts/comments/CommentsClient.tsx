'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Check, Trash2, Reply, MessageSquare, ExternalLink, Edit2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { approvePostComment, deletePostComment, replyToPostComment, editPostComment } from './actions';
import Link from 'next/link';

export function CommentsClient({ initialComments }: { initialComments: any[] }) {
  const [comments, setComments] = useState(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const filteredComments = comments.filter(c => {
    if (filter === 'pending') return !c.isApproved;
    if (filter === 'approved') return c.isApproved;
    return true;
  });

  const handleApprove = async (id: string) => {
    const res = await approvePostComment(id);
    if (res.success) {
      toast.success('نظر با موفقیت تایید شد');
      setComments(comments.map(c => c.id === id ? { ...c, isApproved: true } : c));
    } else {
      toast.error(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این نظر اطمینان دارید؟')) return;
    const res = await deletePostComment(id);
    if (res.success) {
      toast.success('نظر حذف شد');
      setComments(comments.map(c => {
        if (c.id === id) return null; // remove top-level
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.filter((r: any) => r.id !== id)
          }
        }
        return c;
      }).filter(Boolean) as any[]);
    } else {
      toast.error(res.error);
    }
  };

  const handleReply = async (comment: any) => {
    if (!replyContent.trim()) {
      toast.error('متن پاسخ نمیتواند خالی باشد');
      return;
    }
    const res = await replyToPostComment(comment.id, comment.postId, replyContent);
    if (res.success) {
      toast.success('پاسخ با موفقیت ثبت شد');
      setReplyingTo(null);
      setReplyContent('');
      window.location.reload(); 
    } else {
      toast.error(res.error);
    }
  };

  const startEdit = (id: string, currentContent: string) => {
    setEditingId(id);
    setEditContent(currentContent);
  };

  const handleEditSubmit = async (id: string) => {
    if (!editContent.trim()) {
      toast.error('متن نظر نمیتواند خالی باشد');
      return;
    }
    const res = await editPostComment(id, editContent);
    if (res.success) {
      toast.success('نظر ویرایش شد');
      setEditingId(null);
      setComments(comments.map(c => {
        if (c.id === id) return { ...c, content: editContent };
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r: any) => r.id === id ? { ...r, content: editContent } : r)
          }
        }
        return c;
      }));
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filters */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
        <Button 
          variant={filter === 'all' ? 'default' : 'ghost'} 
          onClick={() => setFilter('all')}
          className="rounded-lg h-9"
        >
          همه نظرات
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'ghost'} 
          onClick={() => setFilter('pending')}
          className="rounded-lg h-9 bg-amber-50 text-amber-700 hover:bg-amber-100"
        >
          در انتظار تایید
          <span className="ml-2 bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-xs font-bold">
            {comments.filter(c => !c.isApproved).length}
          </span>
        </Button>
        <Button 
          variant={filter === 'approved' ? 'default' : 'ghost'} 
          onClick={() => setFilter('approved')}
          className="rounded-lg h-9 bg-green-50 text-green-700 hover:bg-green-100"
        >
          تایید شده
        </Button>
      </div>

      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center shadow-sm">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">هیچ نظری در این بخش وجود ندارد.</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      {comment.authorName}
                      {!comment.isApproved && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">در انتظار تایید</span>
                      )}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</span>
                      <span>•</span>
                      <Link href={`/blog/${comment.post.slug}`} target="_blank" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
                        مقاله: {comment.post.title}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!comment.isApproved && (
                      <button onClick={() => handleApprove(comment.id)} className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors" title="تایید نظر">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${replyingTo === comment.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`} title="پاسخ به نظر">
                      <Reply className="w-4 h-4" />
                    </button>
                    <button onClick={() => startEdit(comment.id, comment.content)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-colors" title="ویرایش نظر">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(comment.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors" title="حذف نظر">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {editingId === comment.id ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none min-h-24"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>لغو</Button>
                      <Button size="sm" onClick={() => handleEditSubmit(comment.id)}>ذخیره تغییرات</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="bg-slate-50 border-t border-slate-100 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 mb-2">پاسخ‌های ثبت شده:</h4>
                  {comment.replies.map((reply: any) => (
                    <div key={reply.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-indigo-700">{reply.authorName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{new Date(reply.createdAt).toLocaleDateString('fa-IR')}</span>
                          <button onClick={() => startEdit(reply.id, reply.content)} className="text-slate-300 hover:text-indigo-500 transition-colors" title="ویرایش پاسخ">
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleDelete(reply.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="حذف پاسخ">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {editingId === reply.id ? (
                        <div className="mt-2 flex flex-col gap-2">
                          <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none min-h-20"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>لغو</Button>
                            <Button size="sm" onClick={() => handleEditSubmit(reply.id)}>ذخیره تغییرات</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{reply.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="p-4 border-t border-indigo-100 bg-indigo-50/50 flex flex-col gap-3">
                  <textarea 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`پاسخ به ${comment.authorName}...`}
                    className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-24"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" className="h-9 text-slate-500 hover:bg-slate-200" onClick={() => setReplyingTo(null)}>انصراف</Button>
                    <Button className="h-9 gap-2" onClick={() => handleReply(comment)}>
                      <Reply className="w-4 h-4" />
                      ارسال پاسخ
                    </Button>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}
