import { Controller } from "@hotwired/stimulus"

// 脳タイプ診断のインタラクションを制御するStimulusコントローラー
export default class extends Controller {
  // 動的にバインドするデータ属性の定義
  static values = { questions: Array, profiles: Object }

  // コントローラー接続時の初期化処理
  connect() {
    this.currentIdx = 0
    this.answers = []
    this.checkLocalStorage()
  }

  // ローカルストレージに過去の診断結果が存在するか確認し、ボタンの表示を制御
  checkLocalStorage() {
    const saved = localStorage.getItem('codeApp_result')
    const btnShowResult = document.getElementById('btn-show-result')
    if (saved && btnShowResult) {
      btnShowResult.classList.remove('hidden')
    }
  }

  // クイズの開始処理：状態をリセットし、最初の質問を表示
  startQuiz() {
    this.currentIdx = 0
    this.answers = []
    
    const progressContainer = document.getElementById('progress-container')
    if (progressContainer) {
      progressContainer.classList.remove('hidden')
    }
    
    this.switchStep('quiz')
    this.renderQuestion()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ウェルカム画面への復帰処理
  showWelcome() {
    this.switchStep('welcome')
    const progressContainer = document.getElementById('progress-container')
    if (progressContainer) {
      progressContainer.classList.add('hidden')
    }
  }

  // 現在のインデックスに応じた質問と選択肢の描画
  renderQuestion() {
    const q = this.questionsValue[this.currentIdx]
    const counterEl = document.getElementById('quiz-counter')
    const textEl = document.getElementById('quiz-text')
    const barEl = document.getElementById('progress-bar')
    const optionsContainer = document.getElementById('quiz-options')

    if (counterEl) {
      counterEl.textContent = `質問 ${this.currentIdx + 1} / ${this.questionsValue.length}`
    }
    if (textEl) {
      textEl.textContent = q.text
    }

    // プログレスバーの幅を動的に更新
    if (barEl) {
      const progress = ((this.currentIdx + 1) / this.questionsValue.length) * 100
      barEl.style.width = `${progress}%`
    }

    if (optionsContainer) {
      optionsContainer.innerHTML = ''
      optionsContainer.classList.remove('transition-all', 'duration-300', 'opacity-100', 'translate-y-0')
      optionsContainer.classList.add('opacity-0', 'translate-y-2')
      
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button')
        btn.className = "w-full text-left bg-white hover:bg-indigo-50/40 p-4.5 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 font-bold text-slate-700 hover:text-indigo-900 transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-xs hover:shadow-md flex items-center gap-4 group opacity-0 translate-y-3"
        
        const optionLabels = ['A', 'B', 'C', 'D']
        btn.innerHTML = `
          <span class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-600 flex items-center justify-center text-sm font-black transition-colors">
            ${optionLabels[idx] || ''}
          </span>
          <span class="flex-grow text-sm md:text-base leading-snug font-semibold">${opt.text}</span>
        `
        
        // 選択肢クリック時のインタラクションと回答保持処理
        btn.addEventListener('click', () => {
          btn.classList.add('border-indigo-600', 'bg-indigo-50', 'text-indigo-950')
          btn.querySelector('span')?.classList.remove('bg-slate-50', 'text-slate-400')
          btn.querySelector('span')?.classList.add('bg-indigo-600', 'text-white')
          
          setTimeout(() => this.handleAnswer(opt.brain_type), 220)
        })
        
        optionsContainer.appendChild(btn)

        // スタッガー（順次）アニメーションによるフェードイン
        setTimeout(() => {
          btn.classList.remove('opacity-0', 'translate-y-3')
        }, idx * 60)
      })

      // コンテナ全体のフェードイン制御
      setTimeout(() => {
        optionsContainer.classList.remove('opacity-0', 'translate-y-2')
        optionsContainer.classList.add('transition-all', 'duration-300', 'opacity-100', 'translate-y-0')
      }, 50)
    }
  }

  // ユーザーの回答を記録し、次の質問または結果計算へ移行
  handleAnswer(brainType) {
    this.answers.push(brainType)
    if (this.currentIdx < this.questionsValue.length - 1) {
      this.currentIdx++
      this.renderQuestion()
    } else {
      this.calculateResult()
    }
  }

  // 診断結果の計算（多数決アルゴリズム）とローカルストレージ保存
  calculateResult() {
    this.switchStep('calculating')
    const progressContainer = document.getElementById('progress-container')
    if (progressContainer) {
      progressContainer.classList.add('hidden')
    }

    setTimeout(() => {
      const counts = this.answers.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {})
      const bestType = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
      const profile = this.profilesValue[bestType]

      localStorage.setItem('codeApp_result', JSON.stringify({ type: bestType, timestamp: new Date().toISOString() }))
      this.renderResult(profile)
      this.switchStep('result')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.celebrate()
    }, 1500)
  }

  // 保存された診断結果の復元と表示
  showResult() {
    const saved = JSON.parse(localStorage.getItem('codeApp_result'))
    if (saved && this.profilesValue[saved.type]) {
      this.renderResult(this.profilesValue[saved.type])
      this.switchStep('result')
      const progressContainer = document.getElementById('progress-container')
      if (progressContainer) {
        progressContainer.classList.add('hidden')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // 診断結果のHTMLコンテンツ生成と動的レンダリング
  renderResult(profile) {
    const container = document.getElementById('result-content')
    if (!container) return

    const keywordsArray = Array.isArray(profile.keywords) ? profile.keywords : []
    const bestLearningArray = Array.isArray(profile.best_learning) ? profile.best_learning : []

    const themeMap = {
      'Cheetah': { border: 'border-orange-400' },
      'Owl': { border: 'border-indigo-400' },
      'Elephant': { border: 'border-blue-400' },
      'Dolphin': { border: 'border-emerald-400' }
    }

    let activeTheme = themeMap['Elephant']
    if (profile.title.includes('チーター') || profile.emoji === '🐆') activeTheme = themeMap['Cheetah']
    else if (profile.title.includes('フクロウ') || profile.emoji === '🦉') activeTheme = themeMap['Owl']
    else if (profile.title.includes('ゾウ') || profile.emoji === '🐘') activeTheme = themeMap['Elephant']
    else if (profile.title.includes('イルカ') || profile.emoji === '🐬') activeTheme = themeMap['Dolphin']

    container.innerHTML = `
      <!-- 動物の顔を中心にしたキュートなエンブレムカード -->
      <div class="relative overflow-hidden rounded-[2.5rem] p-6 md:p-8 text-center bg-gradient-to-br ${profile.gradient_from || 'from-indigo-100'} ${profile.gradient_to || 'to-indigo-300'} shadow-md mb-6 border border-white/40">
        
        <!-- サブタイトルバッジ -->
        <span class="inline-block px-5 py-2 rounded-full text-sm md:text-base font-black bg-white/90 backdrop-blur-xs text-slate-800 shadow-sm mb-4 border border-white/60 tracking-wide">
          ${profile.subtitle}
        </span>

        <!-- 顔だけのキュートなキャラクターアバター（タップでもう一度お祝い） -->
        <button type="button" data-action="click->brain-quiz#celebrate" aria-label="もう一度お祝いする"
                class="result-avatar relative inline-flex items-center justify-center w-36 h-36 rounded-full bg-white/95 shadow-xl mb-5 border-4 ${activeTheme.border} cursor-pointer active:scale-95 transition-transform">
          ${profile.image_url
            ? `<img src="${profile.image_url}" alt="${profile.title}のキャラクター" class="w-28 h-28 select-none" draggable="false">`
            : `<span class="text-7xl">${profile.emoji}</span>`}
          <span class="absolute -top-2 -right-1 text-2xl animate-bounce">🎉</span>
        </button>

        <!-- お祝いバナー -->
        <p class="result-banner text-sm font-extrabold text-slate-700 mb-1 tracking-wide">🎂 診断完了！おめでとう！ 🎂</p>

        <!-- メインタイトル -->
        <h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-5">
          ${profile.title} <span class="text-xl md:text-2xl font-bold text-slate-700">タイプ</span>
        </h2>

        <!-- キーワードタグ -->
        <div class="flex flex-wrap justify-center gap-2">
          ${keywordsArray.map(kw => `
            <span class="px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold bg-white/90 border border-white/60 text-slate-700 shadow-2xs transition-colors duration-200 hover:bg-white">
              #${kw}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- 脳の傾向・特徴説明 -->
      <div class="bg-white border-l-4 ${activeTheme.border} border-y border-r border-slate-100 p-5 md:p-6 rounded-r-2xl rounded-l-md shadow-2xs mb-6 text-left transition-all duration-300 hover:shadow-xs">
        <h3 class="text-base md:text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
          <span class="text-xl">🧠</span> 脳の傾向と特徴
        </h3>
        <p class="text-slate-600 leading-relaxed text-sm md:text-base">${profile.description}</p>
      </div>
      
      <!-- おすすめ・避けるべき学習法 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-emerald-50/30 border border-emerald-100/80 p-5 rounded-2xl shadow-2xs text-left transition-all duration-300 hover:shadow-xs">
          <h3 class="font-extrabold text-emerald-800 flex items-center gap-2 text-sm md:text-base mb-3">
            <span class="text-lg">💡</span> おすすめの学習法
          </h3>
          <ul class="space-y-2.5">
            ${bestLearningArray.map(item => `
              <li class="flex items-start gap-2 text-xs md:text-sm text-emerald-950 font-semibold leading-relaxed">
                <svg class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="bg-rose-50/30 border border-rose-100/80 p-5 rounded-2xl shadow-2xs text-left transition-all duration-300 hover:shadow-xs">
          <h3 class="font-extrabold text-rose-800 flex items-center gap-2 text-sm md:text-base mb-3">
            <span class="text-lg">⚠️</span> 避けるべき環境
          </h3>
          <div class="flex items-start gap-2 text-xs md:text-sm text-rose-950 font-semibold leading-relaxed">
            <svg class="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>${profile.worst_learning}</span>
          </div>
        </div>
      </div>

      <!-- デイリーミッション -->
      <div class="bg-slate-900 text-white p-5 md:p-6 rounded-2xl shadow-lg relative overflow-hidden text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <div class="absolute right-0 bottom-0 text-7xl opacity-5 transform translate-x-4 translate-y-4 pointer-events-none select-none">🎯</div>
        <h3 class="font-extrabold text-amber-400 flex items-center gap-2 text-sm md:text-base mb-2.5">
          <span>🎯</span> 今日のミッション (Daily Mission)
        </h3>
        <p class="text-slate-200 text-xs md:text-sm font-medium leading-relaxed">${profile.daily_mission}</p>
      </div>
    `

    const btnShowResult = document.getElementById('btn-show-result')
    if (btnShowResult) {
      btnShowResult.classList.remove('hidden')
    }
  }

  // 誕生日パーティー風のお祝い演出（紙吹雪・風船・クラッカー・キャラのポップ）
  celebrate() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    this.popAvatar()
    this.stopCelebration()

    const layer = document.createElement('div')
    layer.className = 'fixed inset-0 overflow-hidden pointer-events-none z-50'
    layer.setAttribute('aria-hidden', 'true')
    document.body.appendChild(layer)
    this.celebrationLayer = layer

    const w = window.innerWidth
    const h = window.innerHeight
    const colors = ['#F472B6', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#FB7185', '#FDE047']
    const rand = (min, max) => min + Math.random() * (max - min)
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

    const spawn = (css, keyframes, options) => {
      const el = document.createElement('div')
      el.style.cssText = `position:absolute;${css}`
      layer.appendChild(el)
      el.animate(keyframes, { fill: 'forwards', ...options }).onfinish = () => el.remove()
      return el
    }

    // 左右下からのクラッカー噴射
    for (const side of [0, 1]) {
      const originX = side === 0 ? 0 : w
      for (let i = 0; i < 38; i++) {
        const angle = (side === 0 ? rand(-80, -35) : rand(-145, -100)) * Math.PI / 180
        const power = rand(0.45, 0.95) * h * 0.85
        const dx = Math.cos(angle) * power
        const dy = Math.sin(angle) * power
        const size = rand(6, 11)
        const el = spawn(
          `left:${originX}px;top:${h}px;width:${size}px;height:${size * rand(0.4, 1.6)}px;background:${pick(colors)};border-radius:${Math.random() < 0.3 ? '50%' : '2px'};`,
          [
            { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${dx}px,${dy}px) rotate(${rand(180, 540)}deg)`, opacity: 1, offset: 0.45 },
            { transform: `translate(${dx * 1.15}px,${dy + h * 0.9}px) rotate(${rand(540, 900)}deg)`, opacity: 0 }
          ],
          { duration: rand(1800, 2800), easing: 'cubic-bezier(.2,.7,.4,1)', delay: rand(0, 200) }
        )
        el.style.zIndex = 2
      }
    }

    // 上からひらひら降る紙吹雪
    for (let i = 0; i < 70; i++) {
      const size = rand(6, 12)
      const x = rand(0, w)
      const sway = rand(-60, 60)
      spawn(
        `left:${x}px;top:-20px;width:${size}px;height:${size * 0.6}px;background:${pick(colors)};border-radius:2px;`,
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${sway}px,${h * 0.55}px) rotate(${rand(200, 400)}deg)`, opacity: 1, offset: 0.6 },
          { transform: `translate(${-sway}px,${h + 40}px) rotate(${rand(500, 900)}deg)`, opacity: 0.9 }
        ],
        { duration: rand(3200, 5200), delay: rand(0, 1800), easing: 'ease-in-out' }
      )
    }

    // ふわふわ上がる風船
    const balloonColors = ['#FB7185', '#FBBF24', '#60A5FA', '#34D399', '#A78BFA', '#F472B6']
    for (let i = 0; i < 9; i++) {
      const color = balloonColors[i % balloonColors.length]
      const x = rand(4, w - 44)
      const sway = rand(-30, 30)
      const el = spawn(
        `left:${x}px;top:${h + 10}px;width:40px;height:72px;`,
        [
          { transform: 'translate(0,0)', opacity: 1 },
          { transform: `translate(${sway}px,${-h * 0.5}px)`, opacity: 1, offset: 0.55 },
          { transform: `translate(${-sway}px,${-h - 120}px)`, opacity: 1 }
        ],
        { duration: rand(4200, 6200), delay: rand(200, 2200), easing: 'ease-out' }
      )
      el.innerHTML = `<svg viewBox="0 0 40 72" width="40" height="72"><ellipse cx="20" cy="22" rx="17" ry="21" fill="${color}"/><ellipse cx="13" cy="14" rx="4" ry="6" fill="#fff" opacity=".45"/><path d="M20 43 L16 49 L24 49Z" fill="${color}"/><path d="M20 49 Q14 58 20 64 Q26 70 20 72" stroke="#94A3B8" stroke-width="1.5" fill="none"/></svg>`
    }

    // きらきら星と絵文字
    const sparkles = ['✨', '⭐', '🎉', '🎊', '💖', '🎈']
    for (let i = 0; i < 14; i++) {
      const el = spawn(
        `left:${rand(5, w - 30)}px;top:${rand(h * 0.1, h * 0.7)}px;font-size:${rand(18, 30)}px;`,
        [
          { transform: 'scale(0) rotate(0deg)', opacity: 0 },
          { transform: 'scale(1.3) rotate(20deg)', opacity: 1, offset: 0.35 },
          { transform: 'scale(0.9) rotate(-10deg)', opacity: 1, offset: 0.7 },
          { transform: 'scale(0) rotate(40deg)', opacity: 0 }
        ],
        { duration: rand(1400, 2200), delay: rand(100, 2600), easing: 'ease-in-out' }
      )
      el.textContent = pick(sparkles)
    }

    this.celebrationTimer = setTimeout(() => this.stopCelebration(), 8000)
  }

  // キャラクターとバナーのぽよんと弾むアニメーション
  popAvatar() {
    const avatar = this.element.querySelector('.result-avatar')
    const banner = this.element.querySelector('.result-banner')
    avatar?.animate([
      { transform: 'scale(0) rotate(-20deg)' },
      { transform: 'scale(1.25) rotate(8deg)', offset: 0.55 },
      { transform: 'scale(0.92) rotate(-4deg)', offset: 0.78 },
      { transform: 'scale(1) rotate(0deg)' }
    ], { duration: 900, easing: 'cubic-bezier(.3,1.4,.5,1)' })
    banner?.animate([
      { transform: 'translateY(12px) scale(.8)', opacity: 0 },
      { transform: 'translateY(0) scale(1.08)', opacity: 1, offset: 0.6 },
      { transform: 'translateY(0) scale(1)', opacity: 1 }
    ], { duration: 700, delay: 350, easing: 'ease-out', fill: 'backwards' })
  }

  // 演出レイヤーの片付け
  stopCelebration() {
    clearTimeout(this.celebrationTimer)
    this.celebrationLayer?.remove()
    this.celebrationLayer = null
  }

  disconnect() {
    this.stopCelebration()
  }

  // 画面ステップの切り替え制御とアニメーション適用
  switchStep(stepName) {
    const steps = ['welcome', 'quiz', 'calculating', 'result']
    
    steps.forEach(s => {
      const el = document.getElementById(`step-${s}`)
      if (el) {
        el.classList.add('hidden')
        el.classList.remove('opacity-100', 'translate-y-0')
      }
    })
    
    const targetEl = document.getElementById(`step-${stepName}`)
    if (targetEl) {
      targetEl.classList.remove('hidden')
      targetEl.classList.add('opacity-0', 'translate-y-4')
      
      void targetEl.offsetHeight // 強制リフローによるアニメーション発火
      
      targetEl.classList.add('transition-all', 'duration-500', 'ease-out')
      targetEl.classList.remove('opacity-0', 'translate-y-4')
      targetEl.classList.add('opacity-100', 'translate-y-0')
    }
  }
}