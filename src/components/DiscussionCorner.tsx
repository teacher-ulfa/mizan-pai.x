import React, { useState } from 'react';
import { DiscussionPost, StudentProgress } from '../types';
import { ALL_CHAPTERS } from '../data/chaptersData';
import { MessageSquareQuote, Heart, MessageCircle, Send, CheckCircle2, Shield, User, Filter, Sparkles } from 'lucide-react';

interface DiscussionCornerProps {
  discussions: DiscussionPost[];
  onAddPost: (post: Omit<DiscussionPost, 'id' | 'timestamp' | 'likes' | 'replies'>) => void;
  onAddReply: (postId: string, content: string) => void;
  onToggleLike: (postId: string) => void;
  progress: StudentProgress;
  teacherMode: boolean;
}

export const DiscussionCorner: React.FC<DiscussionCornerProps> = ({
  discussions,
  onAddPost,
  onAddReply,
  onToggleLike,
  progress,
  teacherMode
}) => {
  const [filterChapter, setFilterChapter] = useState<number | 'all'>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPostChapter, setSelectedPostChapter] = useState<number>(1);
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    onAddPost({
      chapterId: selectedPostChapter,
      authorName: teacherMode ? "Ulfatul Husna, S.Ag., M.Pd." : `${progress.studentName} (${progress.studentClass})`,
      authorRole: teacherMode ? 'guru' : 'murid',
      content: newPostContent.trim()
    });

    setNewPostContent('');
  };

  const handleSendReply = (postId: string) => {
    const text = replyInput[postId];
    if (!text || !text.trim()) return;

    onAddReply(postId, text.trim());
    setReplyInput(prev => ({ ...prev, [postId]: '' }));
    setActiveReplyBox(null);
  };

  const filteredPosts = filterChapter === 'all'
    ? discussions
    : discussions.filter(d => d.chapterId === filterChapter);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800">
              <MessageSquareQuote className="w-6 h-6 text-emerald-700" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Pojok Diskusi & Refleksi Bersama
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Ruang kolaborasi dan bertukar gagasan kontekstual murid SMA Negeri 1 Krembung didampingi Guru PAI & BP.
            </p>
          </div>

          {/* Adab Diskusi Quick Pill */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-950 space-y-1 max-w-sm">
            <span className="font-bold block text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Adab Diskusi Islami:
            </span>
            <p className="text-slate-600">
              Gunakan kata-kata santun (Qaulan Layyina), hindari debat kusir, dan utamakan tabayyun serta saling menghargai.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Filter Topik Bab:</span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => setFilterChapter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterChapter === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Bab ({discussions.length})
            </button>
            {ALL_CHAPTERS.map(ch => (
              <button
                key={ch.id}
                onClick={() => setFilterChapter(ch.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  filterChapter === ch.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Bab {ch.number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Post Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-700" />
          <span>Tuliskan Pertanyaan atau Refleksi Baru</span>
        </h3>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-64">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Kaitkan dengan Materi:
              </label>
              <select
                value={selectedPostChapter}
                onChange={(e) => setSelectedPostChapter(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
              >
                {ALL_CHAPTERS.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    Bab {ch.number}: {ch.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Isi Pertanyaan / Refleksi Pemikiran:
              </label>
              <textarea
                rows={3}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Bagikan pemikiran, pertanyaan fikih/akhlak, atau studi kasus nyata yang Anda jumpai..."
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Posting sebagai: <strong>{teacherMode ? "Ulfatul Husna, S.Ag., M.Pd. (Guru PAI)" : `${progress.studentName} (${progress.studentClass})`}</strong>
            </span>
            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publikasikan Diskusi</span>
            </button>
          </div>
        </form>
      </div>

      {/* Discussion Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            Belum ada diskusi untuk Bab ini. Jadilah yang pertama memulai diskusi!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const ch = ALL_CHAPTERS.find(c => c.id === post.chapterId);
            return (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                {/* Post Author Bar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                      post.authorRole === 'guru'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{post.authorName}</span>
                        {post.authorRole === 'guru' && (
                          <span className="text-[10px] px-2 py-0.2 bg-amber-500 text-white font-bold rounded-md flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Guru PAI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{post.timestamp}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">
                          Bab {post.chapterId}: {ch?.shortTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line pl-12">
                  {post.content}
                </p>

                {/* Action footer */}
                <div className="pl-12 flex items-center gap-4 pt-2 border-t border-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-1 font-semibold transition-colors ${
                      post.likedByMe ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-600' : ''}`} />
                    <span>{post.likes} Suka</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveReplyBox(activeReplyBox === post.id ? null : post.id)}
                    className="flex items-center gap-1 font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replies.length} Tanggapan</span>
                  </button>
                </div>

                {/* Replies Thread */}
                {post.replies.length > 0 && (
                  <div className="ml-12 pl-4 border-l-2 border-slate-100 space-y-3 pt-2">
                    {post.replies.map(reply => (
                      <div key={reply.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            {reply.authorName}
                            {reply.authorRole === 'guru' && (
                              <span className="text-[9px] px-1.5 bg-amber-500 text-white rounded font-bold">
                                Guru
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Box */}
                {activeReplyBox === post.id && (
                  <div className="ml-12 flex gap-2 pt-2">
                    <input
                      type="text"
                      value={replyInput[post.id] || ''}
                      onChange={(e) => setReplyInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder={teacherMode ? "Tanggapi sebagai Guru PAI..." : "Berikan tanggapan yang santun..."}
                      className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(post.id)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      Kirim
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
