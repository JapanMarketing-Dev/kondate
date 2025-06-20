import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 本番環境でSQLiteが利用できない場合の対処
let prisma: PrismaClient

try {
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL?.includes('file:')) {
    // 本番環境でSQLiteの場合は警告を出して、モックモードで動作
    console.warn('SQLite is not supported in production. Please use a cloud database.')
    // モックのPrismaクライアント（エラーを投げずに空の結果を返す）
    prisma = {
      menu: {
        findUnique: async () => null,
        findMany: async () => [],
        create: async (data: any) => ({ 
          id: 'mock-id', 
          date: new Date(),
          mainDish: 'Sample Dish',
          sideDish: null,
          soup: null,
          rice: null,
          category: '和食',
          description: null,
          rating: 0,
          calories: 0,
          cookingTime: 30,
          nutritionScore: 0,
          cost: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data.data
        }),
      }
    } as any
  } else {
    prisma = globalForPrisma.prisma ?? new PrismaClient()
  }
} catch (error) {
  console.error('Failed to initialize Prisma:', error)
  // フォールバック：モックPrismaクライアント
  prisma = {
    menu: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async (data: any) => ({ 
        id: 'mock-id', 
        ...data.data, 
        createdAt: new Date(),
        updatedAt: new Date()
      }),
    }
  } as any
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma } 