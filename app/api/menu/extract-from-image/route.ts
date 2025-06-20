import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: '画像ファイルが見つかりません' },
        { status: 400 }
      )
    }

    // ファイルをBase64に変換
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = file.type

    // OpenAI Vision APIで画像を解析
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "この画像に写っている料理や食べ物を分析して、献立情報を以下のJSON形式で返してください。画像に複数の料理が写っている場合は、主菜、副菜、汁物、ご飯物に分けて識別してください。\n\n形式:\n{\n  \"mainDish\": \"主菜名\",\n  \"sideDish\": \"副菜名\",\n  \"soup\": \"汁物名\",\n  \"rice\": \"ご飯物名\",\n  \"category\": \"和食/洋食/中華/その他\",\n  \"description\": \"料理の詳細説明\"\n}\n\n不明な項目は空文字にしてください。"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500
    })

    const aiResponse = response.choices[0]?.message?.content || ''
    
    // JSONレスポンスを解析
    let extractedMenu
    try {
      // AIの回答からJSON部分を抽出
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extractedMenu = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('JSON形式の回答が見つかりません')
      }
    } catch {
      // JSONの解析に失敗した場合、デフォルト値を使用
      extractedMenu = {
        mainDish: '画像から料理を識別できませんでした',
        sideDish: '',
        soup: '',
        rice: '',
        category: 'その他',
        description: aiResponse
      }
    }

    return NextResponse.json({
      success: true,
      menu: extractedMenu,
      originalResponse: aiResponse
    })

  } catch (error) {
    console.error('Error extracting menu from image:', error)
    return NextResponse.json(
      { success: false, error: '画像の解析に失敗しました' },
      { status: 500 }
    )
  }
} 