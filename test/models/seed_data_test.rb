require "test_helper"

# 初期データ（db/seeds.rb）・解説YAML・モデル定数の整合性を確認する。
# 本番では bin/render-start がこの seeds を投入するため、ここが壊れると画面が成り立たない。
class SeedDataTest < ActiveSupport::TestCase
  setup do
    silence_seed_output { load Rails.root.join("db/seeds.rb") }
  end

  test "4タイプのプロフィールが投入され、解説YAMLと一致する" do
    assert_equal DiagnosisResult::BRAIN_TYPES.sort, BrainProfile.pluck(:brain_type).sort
    assert_equal DiagnosisResult::BRAIN_TYPES.sort, BrainTypeContent.all.keys.sort
  end

  test "質問は7問で、各質問に4タイプの選択肢が1つずつある" do
    assert_equal DiagnosisResult::QUESTION_COUNT, Question.count
    Question.includes(:options).each do |question|
      assert_equal DiagnosisResult::BRAIN_TYPES.sort, question.options.map(&:brain_type).sort, question.text
    end
  end

  test "プロフィールの画像が実在し、必須項目が埋まっている" do
    BrainProfile.all.each do |profile|
      assert Rails.public_path.join(profile.image_url.delete_prefix("/")).exist?, "#{profile.brain_type} の画像がありません"
      %i[title subtitle description worst_learning daily_mission].each do |field|
        assert profile.public_send(field).present?, "#{profile.brain_type} の #{field} が空です"
      end
      assert profile.keywords.any? && profile.best_learning.any?
    end
  end

  test "シードは何度実行しても件数が増えない" do
    silence_seed_output { load Rails.root.join("db/seeds.rb") }
    assert_equal 4, BrainProfile.count
    assert_equal 7, Question.count
  end

  private

  def silence_seed_output
    original = $stdout
    $stdout = StringIO.new
    yield
  ensure
    $stdout = original
  end
end
