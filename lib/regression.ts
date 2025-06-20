// 単回帰分析ユーティリティ
export interface DataPoint {
  x: number
  y: number
}

export interface RegressionResult {
  slope: number           // 傾き（回帰係数）
  intercept: number       // 切片
  rSquared: number        // 決定係数（R²）
  correlation: number     // 相関係数
  equation: string        // 回帰式
  prediction: (x: number) => number  // 予測関数
  summary: string         // 分析結果のサマリー
}

export interface AnalysisData {
  xLabel: string
  yLabel: string
  data: DataPoint[]
  regression: RegressionResult
}

/**
 * 単回帰分析を実行
 */
export function simpleLinearRegression(data: DataPoint[]): RegressionResult {
  if (data.length < 2) {
    throw new Error('回帰分析には最低2つのデータポイントが必要です')
  }

  const n = data.length
  const sumX = data.reduce((sum, point) => sum + point.x, 0)
  const sumY = data.reduce((sum, point) => sum + point.y, 0)
  const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0)
  const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0)
  const sumYY = data.reduce((sum, point) => sum + point.y * point.y, 0)

  const meanX = sumX / n
  const meanY = sumY / n

  // 回帰係数の計算
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = meanY - slope * meanX

  // 相関係数の計算
  const numerator = n * sumXY - sumX * sumY
  const denominatorX = Math.sqrt(n * sumXX - sumX * sumX)
  const denominatorY = Math.sqrt(n * sumYY - sumY * sumY)
  const correlation = numerator / (denominatorX * denominatorY)

  // 決定係数（R²）の計算
  const rSquared = correlation * correlation

  // 回帰式
  const equation = `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`

  // 予測関数
  const prediction = (x: number) => slope * x + intercept

  // 分析結果のサマリー
  let summary = ''
  if (Math.abs(correlation) >= 0.8) {
    summary = '強い相関関係があります'
  } else if (Math.abs(correlation) >= 0.5) {
    summary = '中程度の相関関係があります'
  } else if (Math.abs(correlation) >= 0.3) {
    summary = '弱い相関関係があります'
  } else {
    summary = '相関関係はほとんどありません'
  }

  if (correlation > 0) {
    summary += '（正の相関）'
  } else {
    summary += '（負の相関）'
  }

  return {
    slope,
    intercept,
    rSquared,
    correlation,
    equation,
    prediction,
    summary
  }
}

/**
 * 献立データから分析用データを抽出
 */
export function extractAnalysisData(
  menus: Array<{
    rating?: number | null
    calories?: number | null
    cookingTime?: number | null
    nutritionScore?: number | null
    cost?: number | null
  }>,
  xField: 'calories' | 'cookingTime' | 'nutritionScore' | 'cost',
  yField: 'rating' | 'calories' | 'cookingTime' | 'nutritionScore' | 'cost'
): DataPoint[] {
  return menus
    .filter(menu => 
      menu[xField] !== null && menu[xField] !== undefined &&
      menu[yField] !== null && menu[yField] !== undefined
    )
    .map(menu => ({
      x: Number(menu[xField]),
      y: Number(menu[yField])
    }))
}

/**
 * フィールド名を日本語ラベルに変換
 */
export function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    rating: '満足度評価',
    calories: 'カロリー',
    cookingTime: '調理時間（分）',
    nutritionScore: '栄養スコア',
    cost: '費用（円）'
  }
  return labels[field] || field
}

/**
 * 予め定義された分析パターン
 */
export const ANALYSIS_PATTERNS = [
  {
    id: 'cooking-satisfaction',
    name: '調理時間と満足度の関係',
    xField: 'cookingTime' as const,
    yField: 'rating' as const,
    description: '調理にかける時間が満足度にどう影響するかを分析します'
  },
  {
    id: 'calorie-satisfaction',
    name: 'カロリーと満足度の関係',
    xField: 'calories' as const,
    yField: 'rating' as const,
    description: 'カロリーの高さと満足度の関係を分析します'
  },
  {
    id: 'nutrition-satisfaction',
    name: '栄養スコアと満足度の関係',
    xField: 'nutritionScore' as const,
    yField: 'rating' as const,
    description: '栄養バランスの良さが満足度に与える影響を分析します'
  },
  {
    id: 'cost-satisfaction',
    name: '費用と満足度の関係',
    xField: 'cost' as const,
    yField: 'rating' as const,
    description: '食費と満足度のコストパフォーマンスを分析します'
  },
  {
    id: 'time-calories',
    name: '調理時間とカロリーの関係',
    xField: 'cookingTime' as const,
    yField: 'calories' as const,
    description: '手間をかけた料理ほど高カロリーになる傾向があるかを分析します'
  }
] as const 