import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { questions: Array, profiles: Object }

  connect() {
    this.currentIdx = 0
    this.answers = []
    this.checkLocalStorage()
  }

  checkLocalStorage() {
    const saved = localStorage.getItem('codeApp_result')
    const btnShowResult = document.getElementById('btn-show-result')
    if (saved && btnShowResult) {
      btnShowResult.classList.remove('hidden')
    }
  }

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

  showWelcome() {
    this.switchStep('welcome')
    const progressContainer = document.getElementById('progress-container')
    if (progressContainer) {
      progressContainer.classList.add('hidden')
    }
  }

  renderQuestion() {
    const q = this.questionsValue[this.currentIdx]
    const counterEl = document.getElementById('quiz-counter')
    const textEl = document.getElementById('quiz-text')
    const barEl = document.getElementById('progress-bar')
    const optionsContainer = document.getElementById('quiz-options')

    if (counterEl) {
      counterEl.textContent = `질문 ${this.currentIdx + 1} / ${this.questionsValue.length}`
    }
    if (textEl) {
      textEl.textContent = q.text
    }

    // 프로그레스 바 업데이트
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
        
        btn.addEventListener('click', () => {
          // 클릭 시 활성화 스타일 강조 후 다음 질문 전환
          btn.classList.add('border-indigo-600', 'bg-indigo-50', 'text-indigo-950')
          btn.querySelector('span')?.classList.remove('bg-slate-50', 'text-slate-400')
          btn.querySelector('span')?.classList.add('bg-indigo-600', 'text-white')
          
          setTimeout(() => this.handleAnswer(opt.brain_type), 220)
        })
        
        optionsContainer.appendChild(btn)

        // 각 선택지 버튼 순차적 페이드인 (Staggered Animation)
        setTimeout(() => {
          btn.classList.remove('opacity-0', 'translate-y-3')
        }, idx * 60)
      })

      // 컨테이너 페이드인 처리
      setTimeout(() => {
        optionsContainer.classList.remove('opacity-0', 'translate-y-2')
        optionsContainer.classList.add('transition-all', 'duration-300', 'opacity-100', 'translate-y-0')
      }, 50)
    }
  }

  handleAnswer(brainType) {
    this.answers.push(brainType)
    if (this.currentIdx < this.questionsValue.length - 1) {
      this.currentIdx++
      this.renderQuestion()
    } else {
      this.calculateResult()
    }
  }

  calculateResult() {
    this.switchStep('calculating')
    const progressContainer = document.getElementById('progress-container')
    if (progressContainer) {
      progressContainer.classList.add('hidden')
    }

    // 가장 많이 나온 브레인 타입 계산 (다수결)
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
    }, 1500)
  }

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

  renderResult(profile) {
    const container = document.getElementById('result-content')
    if (!container) return

    // 키워드 태그가 Array가 아닌 경우를 대비한 안전 가드
    const keywordsArray = Array.isArray(profile.keywords) ? profile.keywords : []
    const bestLearningArray = Array.isArray(profile.best_learning) ? profile.best_learning : []

    // Map animal profile types to dynamic color themes
    const themeMap = {
      'Cheetah': {
        accent: 'orange',
        border: 'border-orange-500',
        text: 'text-orange-700',
        bg: 'bg-orange-50',
        badge: 'bg-orange-50 text-orange-700 border-orange-100'
      },
      'Owl': {
        accent: 'slate',
        border: 'border-slate-500',
        text: 'text-slate-700',
        bg: 'bg-slate-50',
        badge: 'bg-slate-100 text-slate-700 border-slate-200'
      },
      'Elephant': {
        accent: 'indigo',
        border: 'border-indigo-500',
        text: 'text-indigo-700',
        bg: 'bg-indigo-50',
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-100'
      },
      'Dolphin': {
        accent: 'emerald',
        border: 'border-emerald-500',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-100'
      }
    }

    // Find the matching theme based on title or emoji (or default to Elephant)
    let activeTheme = themeMap['Elephant']
    if (profile.title.includes('チーター') || profile.emoji === '🐆') activeTheme = themeMap['Cheetah']
    else if (profile.title.includes('フクロウ') || profile.emoji === '🦉') activeTheme = themeMap['Owl']
    else if (profile.title.includes('ゾ우') || profile.emoji === '🐘') activeTheme = themeMap['Elephant']
    else if (profile.title.includes('イルカ') || profile.emoji === '🐬') activeTheme = themeMap['Dolphin']

    container.innerHTML = `
      <!-- Top Animal Emblem Card with Gradient Background -->
      <div class="relative overflow-hidden rounded-3xl p-6 md:p-8 text-center bg-gradient-to-br ${profile.gradient_from || 'from-indigo-100'} ${profile.gradient_to || 'to-indigo-300'} shadow-md mb-6 border border-white/20">
        <!-- Floating background emojis for premium visual depth -->
        <div class="absolute -top-6 -right-6 text-7xl opacity-10 select-none pointer-events-none animate-pulse">${profile.emoji}</div>
        <div class="absolute -bottom-6 -left-6 text-7xl opacity-10 select-none pointer-events-none animate-pulse" style="animation-delay: 1s;">${profile.emoji}</div>
        
        <!-- Large Animated Emoji Container with hover scaling -->
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/90 backdrop-blur-xs shadow-lg mb-4 text-5xl transform hover:scale-110 hover:rotate-3 transition-all duration-300">
          ${profile.emoji}
        </div>
        
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold bg-white/80 backdrop-blur-xs text-slate-800 shadow-2xs mb-3 border border-white/40">
          ${profile.subtitle}
        </span>
        <h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          ${profile.title} <span class="text-xl md:text-2xl font-bold text-slate-700">타입</span>
        </h2>
      </div>

      <!-- Keywords Tags -->
      <div class="flex flex-wrap justify-center gap-2 mb-6">
        ${keywordsArray.map(kw => `
          <span class="px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold bg-white border border-slate-100 text-slate-600 shadow-2xs transition-colors duration-200 hover:bg-slate-50">
            #${kw}
          </span>
        `).join('')}
      </div>

      <!-- Main Description -->
      <div class="bg-white border-l-4 ${activeTheme.border} border-y border-r border-slate-100 p-5 md:p-6 rounded-r-2xl rounded-l-md shadow-2xs mb-6 text-left transition-all duration-300 hover:shadow-xs">
        <h3 class="text-base md:text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
          <span class="text-xl">🧠</span> 뇌의倾向과 特徴
        </h3>
        <p class="text-slate-600 leading-relaxed text-sm md:text-base">${profile.description}</p>
      </div>
      
      <!-- Recommended and Non-recommended Learning Styles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Best Learning -->
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

        <!-- Worst Learning -->
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

      <!-- Daily Mission -->
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
      
      // 리플로우 강제 유도
      void targetEl.offsetHeight
      
      targetEl.classList.add('transition-all', 'duration-500', 'ease-out')
      targetEl.classList.remove('opacity-0', 'translate-y-4')
      targetEl.classList.add('opacity-100', 'translate-y-0')
    }
  }
}
