import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
export async function GET() {
  const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, phone } = body
  if (!name || !phone) return NextResponse.json({ error: 'name and phone required' }, { status: 400 })
  const { data, error } = await supabase.from('contacts').insert([{ name, phone }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
