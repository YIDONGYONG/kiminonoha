# みんなの診断結果（匿名の集計）を表示する
class StatsController < ApplicationController
  def show
    @total = DiagnosisResult.count
    @public = @total >= DiagnosisResult::MIN_PUBLIC_COUNT
    return unless @public

    @counts = DiagnosisResult.group(:brain_type).count
    @ranking = DiagnosisResult::BRAIN_TYPES.sort_by { |type| -@counts.fetch(type, 0) }
    @top_type = @ranking.first
  end
end
