import { NextRequest, NextResponse } from 'next/server';
import { chatApiClient, ChatMessage } from '@/lib/chatApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message: ChatMessage = {
      text: body.text || "こんにちは！これはサンプルメッセージです。",
      channel: body.channel || "general",
      user: body.user || "demo_user",
      mention: body.mention || "@everyone",
      date: body.date || new Date().toISOString()
    };

    const result = await chatApiClient.sendMessage(message);
    
    if (result.success) {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // デモ用のテストメッセージを送信
    const result = await chatApiClient.sendTestMessage();
    
    if (result.success) {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}