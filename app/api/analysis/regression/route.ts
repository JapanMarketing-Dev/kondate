import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  simpleLinearRegression, 
  extractAnalysisData, 
  getFieldLabel,
  ANALYSIS_PATTERNS,
  type AnalysisData 
} from '@/lib/regression'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const analysisId = searchParams.get('id')
    const xField = searchParams.get('x') as any
    const yField = searchParams.get('y') as any

    // 献立データを取得
    const menus = await prisma.menu.findMany({
      select: {
        rating: true,
        calories: true,
        cookingTime: true,
        nutritionScore: true,
        cost: true
      }
    })

    if (menus.length < 2) {
      return NextResponse.json({
        success: false,
        error: '分析には最低2つの献立データが必要です。もっとデータを登録してください。'
      }, { status: 400 })
    }

    let analyses: AnalysisData[] = []

    if (analysisId) {
      // 特定の分析パターンを実行
      const pattern = ANALYSIS_PATTERNS.find(p => p.id === analysisId)
      if (!pattern) {
        return NextResponse.json({
          success: false,
          error: '指定された分析パターンが見つかりません'
        }, { status: 404 })
      }

      const data = extractAnalysisData(menus, pattern.xField, pattern.yField)
      if (data.length < 2) {
        return NextResponse.json({
          success: false,
          error: `${pattern.name}の分析に必要なデータが不足しています`
        }, { status: 400 })
      }

      const regression = simpleLinearRegression(data)
      analyses.push({
        xLabel: getFieldLabel(pattern.xField),
        yLabel: getFieldLabel(pattern.yField),
        data,
        regression
      })
    } else if (xField && yField) {
      // カスタム分析を実行
      const data = extractAnalysisData(menus, xField, yField)
      if (data.length < 2) {
        return NextResponse.json({
          success: false,
          error: '指定したフィールドの分析に必要なデータが不足しています'
        }, { status: 400 })
      }

      const regression = simpleLinearRegression(data)
      analyses.push({
        xLabel: getFieldLabel(xField),
        yLabel: getFieldLabel(yField),
        data,
        regression
      })
    } else {
      // 全ての定義済み分析パターンを実行
      for (const pattern of ANALYSIS_PATTERNS) {
        const data = extractAnalysisData(menus, pattern.xField, pattern.yField)
        if (data.length >= 2) {
          const regression = simpleLinearRegression(data)
          analyses.push({
            xLabel: getFieldLabel(pattern.xField),
            yLabel: getFieldLabel(pattern.yField),
            data,
            regression
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      analyses,
      dataCount: menus.length,
      patterns: ANALYSIS_PATTERNS
    })

  } catch (error) {
    console.error('Error in regression analysis:', error)
    return NextResponse.json(
      { success: false, error: '回帰分析の実行に失敗しました' },
      { status: 500 }
    )
  }
}

// 分析用のサンプルデータを生成するエンドポイント
export async function POST(request: NextRequest) {
  try {
    const { generateSampleData } = await request.json()
    
    if (!generateSampleData) {
      return NextResponse.json({
        success: false,
        error: 'generateSampleData が true に設定されている必要があります'
      }, { status: 400 })
    }

    // サンプルデータの生成
    const sampleMenus = [
      {
        date: new Date('2024-01-01'),
        mainDish: 'ハンバーグ',
        category: '洋食',
        rating: 4.5,
        calories: 650,
        cookingTime: 45,
        nutritionScore: 7.5,
        cost: 800
      },
      {
        date: new Date('2024-01-02'),
        mainDish: '生姜焼き',
        category: '和食',
        rating: 4.0,
        calories: 580,
        cookingTime: 20,
        nutritionScore: 8.0,
        cost: 600
      },
      {
        date: new Date('2024-01-03'),
        mainDish: '麻婆豆腐',
        category: '中華',
        rating: 3.8,
        calories: 520,
        cookingTime: 30,
        nutritionScore: 6.5,
        cost: 550
      },
      {
        date: new Date('2024-01-04'),
        mainDish: 'サーモンのムニエル',
        category: '洋食',
        rating: 4.8,
        calories: 450,
        cookingTime: 25,
        nutritionScore: 9.0,
        cost: 1200
      },
      {
        date: new Date('2024-01-05'),
        mainDish: '親子丼',
        category: '和食',
        rating: 4.2,
        calories: 680,
        cookingTime: 15,
        nutritionScore: 7.0,
        cost: 450
      }
    ]

    // 重複チェック付きでサンプルデータを作成
    let createdCount = 0
    for (const menu of sampleMenus) {
      try {
        await prisma.menu.create({ data: menu })
        createdCount++
      } catch (error) {
        // 日付の重複などでエラーが発生した場合はスキップ
        console.log(`サンプルデータ作成スキップ: ${menu.mainDish}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdCount}件のサンプルデータを作成しました`,
      createdCount
    })

  } catch (error) {
    console.error('Error creating sample data:', error)
    return NextResponse.json(
      { success: false, error: 'サンプルデータの作成に失敗しました' },
      { status: 500 }
    )
  }
} 