import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 献立一覧の取得
export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      menus
    })

  } catch (error) {
    console.error('Error fetching menus:', error)
    return NextResponse.json(
      { success: false, error: '献立の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 新しい献立の作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, mainDish, sideDish, soup, rice, category, description } = body

    if (!date || !mainDish) {
      return NextResponse.json(
        { success: false, error: '日付と主菜は必須項目です' },
        { status: 400 }
      )
    }

    const menu = await prisma.menu.create({
      data: {
        date: new Date(date),
        mainDish,
        sideDish: sideDish || null,
        soup: soup || null,
        rice: rice || null,
        category: category || '和食',
        description: description || null
      }
    })

    return NextResponse.json({
      success: true,
      menu
    })

  } catch (error) {
    console.error('Error creating menu:', error)
    return NextResponse.json(
      { success: false, error: '献立の作成に失敗しました' },
      { status: 500 }
    )
  }
} 