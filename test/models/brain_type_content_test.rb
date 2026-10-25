require "test_helper"

class BrainTypeContentTest < ActiveSupport::TestCase
  REQUIRED_KEYS = %w[title subtitle summary strengths weaknesses learning work relationships careers tips faq].freeze

  test "4つの脳タイプが定義されている" do
    assert_equal %w[Cheetah Dolphin Elephant Owl], BrainTypeContent.all.keys.sort
  end

  test "すべてのタイプに必要な項目がある" do
    BrainTypeContent.all.each do |key, content|
      REQUIRED_KEYS.each do |required|
        assert content[required].present?, "#{key} に #{required} がありません"
      end
    end
  end

  test "タイプごとのキャラクター画像が存在する" do
    BrainTypeContent.all.each_key do |key|
      assert Rails.public_path.join("characters", "#{key.downcase}.svg").exist?, "#{key} の画像がありません"
    end
  end

  test "スラッグは大文字小文字を区別せず検索できる" do
    key, content = BrainTypeContent.find("OWL")
    assert_equal "Owl", key
    assert_equal "フクロウ", content["title"]
    assert_nil BrainTypeContent.find("unknown")
  end
end
