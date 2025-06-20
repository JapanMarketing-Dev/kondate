'use client'

import { useState, useEffect } from 'react'

interface Menu {
  id: string
  date: string
  mainDish: string
  sideDish: string | null
  soup: string | null
  rice: string | null
  category: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [todayMenu, setTodayMenu] = useState<Menu | null>(null)
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // フォーム用のstate
  const [formData, setFormData] = useState({
    date: '',
    mainDish: '',
    sideDish: '',
    soup: '',
    rice: '',
    category: '和食',
    description: ''
  })

  // 今日の献立を取得
  const fetchTodayMenu = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/menu/today')
      const data = await response.json()
      if (data.success) {
        setTodayMenu(data.menu)
      }
    } catch (error) {
      console.error('Error fetching today menu:', error)
    } finally {
      setLoading(false)
    }
  }

  // 献立一覧を取得
  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menu')
      const data = await response.json()
      if (data.success) {
        setMenus(data.menus)
      }
    } catch (error) {
      console.error('Error fetching menus:', error)
    }
  }

  // 新しい献立を作成
  const createMenu = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        alert('献立を登録しました！')
        setFormData({
          date: '',
          mainDish: '',
          sideDish: '',
          soup: '',
          rice: '',
          category: '和食',
          description: ''
        })
        setShowForm(false)
        fetchMenus() // 一覧を再取得
      } else {
        alert(data.error || '献立の登録に失敗しました')
      }
    } catch (error) {
      console.error('Error creating menu:', error)
      alert('献立の登録に失敗しました')
    }
  }

  // 画像から献立を抽出
  const extractFromImage = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/menu/extract-from-image', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      
      if (data.success) {
        // 抽出された献立情報をフォームに自動入力
        setFormData(prev => ({
          ...prev,
          mainDish: data.menu.mainDish || '',
          sideDish: data.menu.sideDish || '',
          soup: data.menu.soup || '',
          rice: data.menu.rice || '',
          category: data.menu.category || '和食',
          description: data.menu.description || ''
        }))
        setShowImageUpload(false)
        setShowForm(true)
        alert('画像から献立情報を抽出しました！フォームを確認してください。')
      } else {
        alert(data.error || '画像の解析に失敗しました')
      }
    } catch (error) {
      console.error('Error extracting from image:', error)
      alert('画像の解析に失敗しました')
    } finally {
      setUploadingImage(false)
    }
  }

  // ファイルアップロードハンドラー
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      extractFromImage(file)
    }
  }

  useEffect(() => {
    fetchTodayMenu()
    fetchMenus()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 animate-slide-down">
            🍽️ 今日の献立
          </h1>
          <p className="text-xl text-gray-800 animate-slide-up">
            毎日の食事を楽しく計画しましょう
          </p>
        </header>

        {/* 今日の献立セクション */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">📅</span>
              今日の献立
            </h2>
            <button
              onClick={fetchTodayMenu}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  取得中...
                </div>
              ) : (
                '✨ 新しい献立を取得'
              )}
            </button>
          </div>
          
          {todayMenu ? (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-200">
                  <strong className="text-gray-900 text-lg">🍖 主菜:</strong> 
                  <span className="ml-2 text-gray-900 font-medium">{todayMenu.mainDish}</span>
                </div>
                {todayMenu.sideDish && (
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-200">
                    <strong className="text-gray-900 text-lg">🥗 副菜:</strong> 
                    <span className="ml-2 text-gray-900 font-medium">{todayMenu.sideDish}</span>
                  </div>
                )}
                {todayMenu.soup && (
                  <div className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl border-l-4 border-yellow-500 transform hover:scale-105 transition-all duration-200">
                    <strong className="text-gray-900 text-lg">🍲 汁物:</strong> 
                    <span className="ml-2 text-gray-900 font-medium">{todayMenu.soup}</span>
                  </div>
                )}
                {todayMenu.rice && (
                  <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl border-l-4 border-orange-500 transform hover:scale-105 transition-all duration-200">
                    <strong className="text-gray-900 text-lg">🍚 ご飯物:</strong> 
                    <span className="ml-2 text-gray-900 font-medium">{todayMenu.rice}</span>
                  </div>
                )}
                <div className="p-4 bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-200">
                  <strong className="text-gray-900 text-lg">🏷️ カテゴリ:</strong> 
                  <span className="ml-2 text-gray-900 font-medium">{todayMenu.category}</span>
                </div>
              </div>
              {todayMenu.description && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-inner">
                  <strong className="text-gray-900 text-lg block mb-3">📝 詳細:</strong>
                  <p className="text-gray-900 leading-relaxed">{todayMenu.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-pulse text-gray-800 text-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                献立を取得中...
              </div>
            </div>
          )}
        </section>

        {/* 献立登録セクション */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">➕</span>
              献立を登録
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                📸 画像から抽出
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {showForm ? '📝 フォームを閉じる' : '✏️ 手動で登録'}
              </button>
            </div>
          </div>

          {/* 画像アップロードセクション */}
          {showImageUpload && (
            <div className="mb-6 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200 animate-fade-in">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📷</span>
                画像から献立を抽出
              </h3>
              <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center hover:border-pink-400 transition-colors duration-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer ${uploadingImage ? 'cursor-not-allowed' : ''}`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
                      <p className="text-gray-900 font-medium">画像を解析中...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-gray-900 font-medium text-lg">
                        クリックして画像をアップロード
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        料理の写真から自動で献立情報を抽出します
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* フォームセクション */}
          {showForm && (
            <form onSubmit={createMenu} className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">📅 日付 *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">🏷️ カテゴリ</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  >
                    <option value="和食">🍱 和食</option>
                    <option value="洋食">🍽️ 洋食</option>
                    <option value="中華">🥢 中華</option>
                    <option value="その他">🌍 その他</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">🍖 主菜 *</label>
                <input
                  type="text"
                  required
                  value={formData.mainDish}
                  onChange={(e) => setFormData({...formData, mainDish: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="例: 生姜焼き"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">🥗 副菜</label>
                  <input
                    type="text"
                    value={formData.sideDish}
                    onChange={(e) => setFormData({...formData, sideDish: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="例: サラダ"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">🍲 汁物</label>
                  <input
                    type="text"
                    value={formData.soup}
                    onChange={(e) => setFormData({...formData, soup: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="例: 味噌汁"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">🍚 ご飯物</label>
                  <input
                    type="text"
                    value={formData.rice}
                    onChange={(e) => setFormData({...formData, rice: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="例: 白ご飯"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">📝 説明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  rows={4}
                  placeholder="献立の詳細や調理のポイントなど"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                ✅ 献立を登録
              </button>
            </form>
          )}
        </section>

        {/* 献立一覧セクション */}
        <section className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">📚</span>
            献立履歴
          </h2>
          
          {menus.length > 0 ? (
            <div className="space-y-6">
              {menus.map((menu, index) => (
                <div 
                  key={menu.id} 
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-gray-900">
                      📅 {new Date(menu.date).toLocaleDateString('ja-JP')}
                    </h3>
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                      {menu.category}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-900">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">🍖</span>
                      <strong>主菜:</strong> 
                      <span className="ml-2 font-medium">{menu.mainDish}</span>
                    </div>
                    {menu.sideDish && (
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🥗</span>
                        <strong>副菜:</strong> 
                        <span className="ml-2 font-medium">{menu.sideDish}</span>
                      </div>
                    )}
                    {menu.soup && (
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🍲</span>
                        <strong>汁物:</strong> 
                        <span className="ml-2 font-medium">{menu.soup}</span>
                      </div>
                    )}
                    {menu.rice && (
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🍚</span>
                        <strong>ご飯物:</strong> 
                        <span className="ml-2 font-medium">{menu.rice}</span>
                      </div>
                    )}
                  </div>
                  {menu.description && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 leading-relaxed">
                        <span className="font-semibold">📝 詳細: </span>
                        {menu.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-800 text-lg">まだ献立が登録されていません。</p>
              <p className="text-gray-700 mt-2">最初の献立を登録してみましょう！</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
