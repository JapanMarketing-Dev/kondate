'use client';

import { useState } from 'react';
import { ChatMessage, ChatAPIResponse } from '@/lib/chatApi';

export default function ChatTestPage() {
  const [message, setMessage] = useState<ChatMessage>({
    text: "こんにちは！これはサンプルメッセージです。",
    channel: "general",
    user: "demo_user",
    mention: "@everyone",
    date: new Date().toISOString()
  });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ChatMessage, value: string) => {
    setMessage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sendMessage = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'API request failed');
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'GET',
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'API request failed');
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const setCurrentDate = () => {
    const now = new Date().toISOString();
    handleInputChange('date', now);
  };

  const loadDemoData = () => {
    setMessage({
      text: "今日は素晴らしい一日ですね！",
      channel: "雑談",
      user: "田中太郎",
      mention: "@チーム",
      date: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">チャットAPI テスト</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* 入力フォーム */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">メッセージ入力</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Text</label>
              <textarea
                value={message.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="メッセージテキスト"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Channel</label>
              <input
                type="text"
                value={message.channel}
                onChange={(e) => handleInputChange('channel', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="チャンネル"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">User</label>
              <input
                type="text"
                value={message.user}
                onChange={(e) => handleInputChange('user', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ユーザー"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Mention</label>
              <input
                type="text"
                value={message.mention}
                onChange={(e) => handleInputChange('mention', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="メンション"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="日付"
                />
                <button
                  onClick={setCurrentDate}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  現在時刻
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 space-x-3">
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '送信中...' : 'カスタムメッセージ送信'}
            </button>
            
            <button
              onClick={sendTestMessage}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '送信中...' : 'テストメッセージ送信'}
            </button>
            
            <button
              onClick={loadDemoData}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              デモデータ読み込み
            </button>
          </div>
        </div>

        {/* レスポンス表示 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">API レスポンス</h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">API を呼び出しています...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">エラー</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {response && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-green-800 font-medium mb-2">成功レスポンス</h3>
              <pre className="text-sm text-green-700 bg-green-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          {!loading && !error && !response && (
            <div className="text-center py-8 text-gray-500">
              <p>メッセージを送信すると、ここにレスポンスが表示されます。</p>
            </div>
          )}
        </div>
      </div>

      {/* API詳細 */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">API詳細</h2>
        <div className="space-y-2 text-sm">
          <p><strong>エンドポイント:</strong> https://xrvp-5l6a-rpaf.t7.xano.io/api:z1PY1HTu/chat</p>
          <p><strong>メソッド:</strong> POST</p>
          <p><strong>Content-Type:</strong> application/json</p>
          <p><strong>ペイロード例:</strong></p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{
  "text": "こんにちは！これはサンプルメッセージです。",
  "channel": "general",
  "user": "demo_user",
  "mention": "@everyone",
  "date": "2024-01-01T12:00:00.000Z"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}