require "test_helper"

class QuestionTest < ActiveSupport::TestCase
  test "質問は複数の選択肢を持つ" do
    assert_equal 2, questions(:one).options.count
  end

  test "質問を削除すると選択肢も削除される" do
    assert_difference("Option.count", -2) { questions(:one).destroy }
  end
end
