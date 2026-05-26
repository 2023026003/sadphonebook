import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { name, phone } = body
  if (!name || !phone) return NextResponse.json({ error: '이름과 전화번호는 필수입니다.' }, { status: 400 })
  const { data, error } = await supabase
    .from('contacts')
    .update({ name, phone, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('contacts').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
