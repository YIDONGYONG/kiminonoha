# 診断結果（匿名）。名前・メールアドレス・IPアドレスは保存しない
class DiagnosisResult < ApplicationRecord
  BRAIN_TYPES = %w[Cheetah Owl Elephant Dolphin].freeze
  QUESTION_COUNT = 7
  # 少数の回答から個人が推測されないよう、この件数未満では集計を公開しない
  MIN_PUBLIC_COUNT = 5

  validates :brain_type, inclusion: { in: BRAIN_TYPES }
  validate :answers_must_be_valid

  private

  # 回答は質問数ぶんあり、すべて既知のタイプであること
  def answers_must_be_valid
    unless answers.is_a?(Array) && answers.size == QUESTION_COUNT && answers.all? { |a| BRAIN_TYPES.include?(a) }
      errors.add(:answers, "が不正です")
    end
  end
end
