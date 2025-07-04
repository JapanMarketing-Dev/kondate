/**
 * チャットAPI テストファイル
 */

const TEST_BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🚀 チャットAPI テストを開始します...\n');
  
  // Test 1: GETリクエストでテストメッセージを送信
  console.log('1. GETリクエストテスト (テストメッセージ送信)');
  try {
    const response = await fetch(`${TEST_BASE_URL}/api/chat`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ 成功:', data);
    } else {
      console.log('   ❌ エラー:', data);
    }
  } catch (error) {
    console.log('   ❌ 例外:', error.message);
  }
  console.log('');
  
  // Test 2: POSTリクエストでカスタムメッセージを送信
  console.log('2. POSTリクエストテスト (カスタムメッセージ送信)');
  try {
    const customMessage = {
      text: `JavaScript Test Message - ${new Date().toISOString()}`,
      channel: 'test-channel',
      user: 'test-user',
      mention: '@everyone',
      date: new Date().toISOString()
    };
    
    const response = await fetch(`${TEST_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customMessage)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ 成功:', data);
    } else {
      console.log('   ❌ エラー:', data);
    }
  } catch (error) {
    console.log('   ❌ 例外:', error.message);
  }
  console.log('');
  
  // Test 3: 複数のメッセージを並列で送信
  console.log('3. 複数メッセージ並列送信テスト');
  try {
    const promises = [];
    
    for (let i = 1; i <= 3; i++) {
      const message = {
        text: `Parallel Test Message ${i}`,
        channel: `channel-${i}`,
        user: `user-${i}`,
        mention: `@user-${i}`,
        date: new Date().toISOString()
      };
      
      promises.push(
        fetch(`${TEST_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        })
      );
    }
    
    const responses = await Promise.all(promises);
    const results = await Promise.all(responses.map(r => r.json()));
    
    results.forEach((result, index) => {
      if (responses[index].ok) {
        console.log(`   ✅ メッセージ ${index + 1}:`, result);
      } else {
        console.log(`   ❌ メッセージ ${index + 1}:`, result);
      }
    });
  } catch (error) {
    console.log('   ❌ 例外:', error.message);
  }
  console.log('');
  
  // Test 4: エラーケースのテスト
  console.log('4. エラーケーステスト (無効なJSON)');
  try {
    const response = await fetch(`${TEST_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ⚠️ 意外にも成功:', data);
    } else {
      console.log('   ✅ 正常にエラー:', data);
    }
  } catch (error) {
    console.log('   ✅ 正常にエラー:', error.message);
  }
  console.log('');
  
  console.log('🎉 テスト完了！');
  
  // UIページのテスト
  console.log('\n5. UIページテスト');
  try {
    const response = await fetch(`${TEST_BASE_URL}/chat-test`);
    
    if (response.ok) {
      console.log('   ✅ UIページは正常に表示されています');
      console.log('   🌐 ブラウザで http://localhost:3000/chat-test を開いてテストできます');
    } else {
      console.log('   ❌ UIページでエラーが発生しました');
    }
  } catch (error) {
    console.log('   ❌ UIページテストでエラー:', error.message);
  }
}

// Node.jsで実行
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  testAPI().catch(console.error);
}