require "test_helper"

class OptionTest < ActiveSupport::TestCase
  test "質問に紐づいていない選択肢は無効" do
    assert_not Option.new(text: "テスト", brain_type: "Owl").valid?
  end

  test "質問に紐づく選択肢は有効" do
    assert Option.new(text: "テスト", brain_type: "Owl", question: questions(:one)).valid?
  end
end
