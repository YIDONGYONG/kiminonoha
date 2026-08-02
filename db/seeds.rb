# 기존 데이터 초기화
Option.destroy_all
Question.destroy_all
BrainProfile.destroy_all

puts "Seeding Brain Profiles..."

brain_types_data = {
  'Cheetah' => {
    title: 'チーター',
    subtitle: '圧倒的なスピードと即断即決',
    color: 'text-orange-600',
    bg_color: 'bg-orange-50',
    gradient_from: 'from-orange-100',
    gradient_to: 'to-orange-300',
    emoji: '🐆',
    image_url: 'https://img.freepik.com/free-vector/cute-cheetah-cartoon-vector-illustration_1308-124458.jpg',
    keywords: [ 'スピード', '直感', '実行力', '適応' ],
    description: 'あなたは瞬発力に優れたチータータイプです。目標に向かって真っ直ぐ突き進む姿は周囲に活力を与えます。',
    best_learning: [ '短期間の集中学習', 'ゲーム感覚の課題', '即時のフィードバック' ],
    worst_learning: '長引く会議や、実行のない計画',
    daily_mission: '今日一番やりたいことを、すぐに5分だけ実行してみましょう。'
  },
  'Owl' => {
    title: 'フクロウ',
    subtitle: '冷静沈着な分析家',
    color: 'text-slate-600',
    bg_color: 'bg-slate-100',
    gradient_from: 'from-slate-200',
    gradient_to: 'to-slate-400',
    emoji: '🦉',
    image_url: 'https://img.freepik.com/free-vector/cute-owl-cartoon-vector-illustration_1308-124446.jpg',
    keywords: [ '論理性', '洞察力', '戦略', '静寂' ],
    description: 'あなたは夜の森を見渡すフクロウのように、物事の本質を冷静に見抜く力を持っています。',
    best_learning: [ '体系的な理論学習', 'マインドマップの活用', '深い内省' ],
    worst_learning: '根拠のない指示や、騒がしい環境',
    daily_mission: '今日得た知識を一つ、論理的に整理して書き留めてみましょう。'
  },
  'Elephant' => {
    title: 'ゾウ',
    subtitle: '確かな記憶と安定感',
    color: 'text-indigo-500',
    bg_color: 'bg-indigo-50',
    gradient_from: 'from-indigo-100',
    gradient_to: 'to-indigo-300',
    emoji: '🐘',
    image_url: 'https://img.freepik.com/free-vector/cute-elephant-cartoon-vector-illustration_1308-124430.jpg',
    keywords: [ '記憶力', '安定', '伝統', '忍耐' ],
    description: 'あなたは一度覚えたことを忘れないゾウのように、豊富な知識と経験を活かして着実に歩むタイプです。',
    best_learning: [ '反復学習', '過去の事例研究', '視覚的なストーリー' ],
    worst_learning: '急激な変化や、無秩序な環境',
    daily_mission: '過去に学んだ大切なことを一つ思い出し、今の状況に活かしてみましょう。'
  },
  'Dolphin' => {
    title: 'イルカ',
    subtitle: '調和と共感のメッセンジャー',
    color: 'text-emerald-500',
    bg_color: 'bg-emerald-50',
    gradient_from: 'from-emerald-100',
    gradient_to: 'to-emerald-300',
    emoji: '🐬',
    image_url: 'https://cdn.pixabay.com/photo/2014/04/03/11/47/dolphin-312111_1280.png',
    keywords: [ '共感', '繋がり', '協調', '癒やし' ],
    description: 'あなたは海を自由に泳ぐイルカのように、周囲とのコミュニケーションを大切にし、調和を生み出すタイプです。',
    best_learning: [ 'ディスカッション', 'ペア学習', '感情を込めた学習' ],
    worst_learning: '過度な競争や、冷淡な人間関係',
    daily_mission: '大切な人に感謝のメッセージを一つ送ってみましょう。'
  }
}

brain_types_data.each do |type, data|
  BrainProfile.create!(
    brain_type: type,
    title: data[:title],
    subtitle: data[:subtitle],
    color: data[:color],
    bg_color: data[:bg_color],
    gradient_from: data[:gradient_from],
    gradient_to: data[:gradient_to],
    emoji: data[:emoji],
    image_url: data[:image_url],
    keywords: data[:keywords],
    description: data[:description],
    best_learning: data[:best_learning],
    worst_learning: data[:worst_learning],
    daily_mission: data[:daily_mission]
  )
end

puts "Seeding Questions and Options..."

questions_data = [
  {
    text: "あなたの行動スタイルは？",
    options: [
      { text: "すぐに行動し、素早く結果を出したい", type: 'Cheetah' },
      { text: "じっくり戦略を立ててから動き出したい", type: 'Owl' },
      { text: "過去の経験を活かして丁寧に進めたい", type: 'Elephant' },
      { text: "周りと協力しながら楽しく進めたい", type: 'Dolphin' }
    ]
  },
  {
    text: "新しい情報を学ぶとき、どうする？",
    options: [
      { text: "要点だけを素早く掴み、即実践する", type: 'Cheetah' },
      { text: "論理的に納得できるまで深く掘り下げる", type: 'Owl' },
      { text: "体系的に順序立てて一つずつ覚える", type: 'Elephant' },
      { text: "人と意見を交わしながら対話で学ぶ", type: 'Dolphin' }
    ]
  },
  {
    text: "一番ストレスを感じる瞬間は？",
    options: [
      { text: "物事が停滞し、スピード感が失われること", type: 'Cheetah' },
      { text: "根拠のない決断や、論理性の欠如", type: 'Owl' },
      { text: "急な予定変更や、安定が損なわれること", type: 'Elephant' },
      { text: "対立や孤立など、人間関係の不調和", type: 'Dolphin' }
    ]
  },
  {
    text: "自分の最大の強みは？",
    options: [
      { text: "圧倒的なスピードと実行力", type: 'Cheetah' },
      { text: "鋭い洞察力と冷静な分析力", type: 'Owl' },
      { text: "豊富な知識と揺るぎない安定感", type: 'Elephant' },
      { text: "高い共感力とチームをまとめる力", type: 'Dolphin' }
    ]
  },
  {
    text: "トラブルが起きたとき、どう動く？",
    options: [
      { text: "まずは解決策を試し、走りながら考える", type: 'Cheetah' },
      { text: "原因を徹底的に分析し、根本から解決する", type: 'Owl' },
      { text: "過去の似た事例を思い出し、確実に対処する", type: 'Elephant' },
      { text: "周囲に相談し、全員が納得できる道を探す", type: 'Dolphin' }
    ]
  },
  {
    text: "最も大切にしている価値観は？",
    options: [
      { text: "効率性とスピード", type: 'Cheetah' },
      { text: "正確性と知性", type: 'Owl' },
      { text: "安定と経験", type: 'Elephant' },
      { text: "調和とつながり", type: 'Dolphin' }
    ]
  },
  {
    text: "周りから言われるあなたの印象は？",
    options: [
      { text: "エネルギッシュで決断が早い人", type: 'Cheetah' },
      { text: "頭の回転が速く、冷静でスマートな人", type: 'Owl' },
      { text: "頼りがいがあって記憶力が抜群な人", type: 'Elephant' },
      { text: "優しくてコミュニケーション能力が高い人", type: 'Dolphin' }
    ]
  }
]

questions_data.each do |q_data|
  question = Question.create!(text: q_data[:text])
  q_data[:options].each do |opt|
    question.options.create!(text: opt[:text], brain_type: opt[:type])
  end
end

puts "Seed data generated successfully!"
