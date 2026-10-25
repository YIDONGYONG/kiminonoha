module ApplicationHelper
  SITE_NAME = "君の脳".freeze
  DEFAULT_DESCRIPTION = "7つの質問で分かる無料の脳タイプ診断。チーター・フクロウ・ゾウ・イルカの4タイプから、あなたの学び方・仕事の進め方・人との関わり方のヒントを見つけましょう。".freeze

  def page_title
    title = content_for(:title)
    title.present? ? "#{title} | #{SITE_NAME}" : "#{SITE_NAME} - 無料の脳タイプ診断"
  end

  def page_description
    content_for(:description).presence || DEFAULT_DESCRIPTION
  end

  # 「**強調**」を太字に変換する（HTMLはエスケープ済み）
  def emphasize(text)
    escaped = ERB::Util.html_escape(text)
    escaped.gsub(/\*\*(.+?)\*\*/, '<strong class="font-black text-slate-900 bg-yellow-100/80 px-0.5 rounded">\1</strong>').html_safe
  end
end
