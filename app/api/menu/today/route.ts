import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // 時刻を00:00:00にリセット

    // データベースから今日の献立を検索
    let todayMenu = await prisma.menu.findUnique({
      where: {
        date: today
      }
    })

    // 今日の献立がデータベースに存在しない場合、ChatGPTで生成
    if (!todayMenu) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "あなたは経験豊富な料理人です。健康的でバランスの取れた日本の家庭料理の献立を提案してください。主菜、副菜、汁物、ご飯物を含めて提案してください。"
          },
          {
            role: "user",
            content: "今日の夕食の献立を教えてください。"
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      const aiResponse = completion.choices[0]?.message?.content || '献立の生成に失敗しました'
      
      // ChatGPTの回答から献立情報を抽出（簡単な処理）
      const menuData = {
        date: today,
        mainDish: '生姜焼き', // デフォルト値（実際にはAIの回答を解析）
        sideDish: 'キャベツサラダ',
        soup: 'わかめの味噌汁',
        rice: '白ご飯',
        category: '和食',
        description: aiResponse
      }

      // データベースに保存
      todayMenu = await prisma.menu.create({
        data: menuData
      })
    }

    return NextResponse.json({
      success: true,
      menu: todayMenu
    })

  } catch (error) {
    console.error('Error fetching today\'s menu:', error)
    return NextResponse.json(
      { success: false, error: '今日の献立の取得に失敗しました' },
      { status: 500 }
    )
  }
} 