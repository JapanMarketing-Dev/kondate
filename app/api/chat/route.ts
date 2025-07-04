import { NextRequest, NextResponse } from 'next/server';
import { chatApiClient, ChatMessage } from '@/lib/chatApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message: ChatMessage = {
      text: body.text || "1",
      channel: body.channel || "2",
      user: body.user || "3",
      mention: body.mention || "4",
      date: body.date || "5"
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
    // テスト用のデフォルトメッセージを送信
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