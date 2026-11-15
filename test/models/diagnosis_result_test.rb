require "test_helper"

class DiagnosisResultTest < ActiveSupport::TestCase
  def valid_attributes(overrides = {})
    { brain_type: "Owl", answers: %w[Owl Owl Cheetah Owl Elephant Owl Dolphin] }.merge(overrides)
  end

  test "正しい値なら保存できる" do
    assert DiagnosisResult.create(valid_attributes).persisted?
  end

  test "未知の脳タイプは無効" do
    assert_not DiagnosisResult.new(valid_attributes(brain_type: "Dragon")).valid?
  end

  test "回答は質問数ぶん必要" do
    assert_not DiagnosisResult.new(valid_attributes(answers: %w[Owl Owl])).valid?
  end

  test "回答に未知のタイプが含まれると無効" do
    assert_not DiagnosisResult.new(valid_attributes(answers: %w[Owl Owl Owl Owl Owl Owl Dragon])).valid?
  end
end
