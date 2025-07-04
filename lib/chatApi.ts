/**
 * Chat API Client
 * 
 * This module provides functionality to send chat messages to the specified API endpoint.
 */

export interface ChatMessage {
  text: string;
  channel: string;
  user: string;
  mention: string;
  date: string;
}

export interface ChatAPIResponse {
  success?: boolean;
  data?: any;
  error?: string;
}

export class ChatAPIClient {
  private baseUrl = "https://xrvp-5l6a-rpaf.t7.xano.io/api:z1PY1HTu/chat";
  private headers = {
    "Content-Type": "application/json",
  };

  async sendMessage(message: ChatMessage): Promise<ChatAPIResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("API request failed:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  async sendTestMessage(): Promise<ChatAPIResponse> {
    const now = new Date().toISOString();
    return this.sendMessage({
      text: "こんにちは！これはテストメッセージです。",
      channel: "general",
      user: "demo_user",
      mention: "@everyone",
      date: now,
    });
  }
}

// シングルトンインスタンス
export const chatApiClient = new ChatAPIClient();