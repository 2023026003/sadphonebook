'use client'
import { useEffect, useState } from 'react'
import { Contact } from '@/types/contact'

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', phone: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchContacts = async () => {
    setLoading(true)
    const res = await fetch('/api/contacts')
    const json = await res.json()
    setContacts(json.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchContacts() }, [])

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  const handleAdd = async () => {
    if (!form.name.trim() || !form.phone.trim()) { setError('이름과 전화번호를 모두 입력해주세요.'); return }
    setError(''); setSubmitting(true)
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setForm({ name: '', phone: '' }); await fetchContacts() }
    else { const json = await res.json(); setError(json.error || '추가 실패') }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 연락처를 삭제하시겠습니까?')) return
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    await fetchContacts()
  }

  const startEdit = (contact: Contact) => {
    setEditId(contact.id)
    setEditForm({ name: contact.name, phone: contact.phone })
  }

  const handleSaveEdit = async (id: string) => {
    if (!editForm.name.trim() || !editForm.phone.trim()) return
    setSubmitting(true)
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) { setEditId(null); await fetchContacts() }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">📞</div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">전화번호 관리</h1>
              <p className="text-xs text-slate-500">Phone Book Manager</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">새 연락처 추가</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="이름" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
            <input type="tel" placeholder="전화번호 (예: 010-1234-5678)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
            <button onClick={handleAdd} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-50 whitespace-nowrap">{submitting ? '추가 중...' : '+ 추가'}</button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input type="text" placeholder="이름 또는 전화번호로 검색" value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition shadow-sm" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">연락처 목록</span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filtered.length}건</span>
          </div>
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-sm"><div className="animate-spin text-3xl mb-3">⟳</div>불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400"><div className="text-4xl mb-3">📭</div><p className="text-sm">{search ? '검색 결과가 없습니다.' : '저장된 연락처가 없습니다.'}</p></div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map(contact => (
                <li key={contact.id} className="px-5 py-4 hover:bg-slate-50 transition">
                  {editId === contact.id ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="flex-1 border border-blue-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                      <input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="flex-1 border border-blue-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveEdit(contact.id)} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50">저장</button>
                        <button onClick={() => setEditId(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-lg transition">취소</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">{contact.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{contact.name}</p>
                        <p className="text-xs text-slate-500 truncate">{contact.phone}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => startEdit(contact)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition text-sm" title="수정">✏️</button>
                        <button onClick={() => handleDelete(contact.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition text-sm" title="삭제">🗑️</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
