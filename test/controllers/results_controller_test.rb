require "test_helper"

class ResultsControllerTest < ActionDispatch::IntegrationTest
  ANSWERS = %w[Owl Owl Cheetah Owl Elephant Owl Dolphin].freeze

  test "診断結果を保存する" do
    assert_difference("DiagnosisResult.count", 1) do
      post results_url, params: { brain_type: "Owl", answers: ANSWERS }, as: :json
    end
    assert_response :created
  end

  test "不正な結果は保存されない" do
    assert_no_difference("DiagnosisResult.count") do
      post results_url, params: { brain_type: "Dragon", answers: ANSWERS }, as: :json
    end
    assert_response :unprocessable_entity
  end

  test "回答が配列でない・数が合わない・巨大な場合は保存されない" do
    invalid_payloads = [
      { brain_type: "Owl", answers: { "0" => "Owl" } },
      { brain_type: "Owl", answers: [ "Owl" ] * (DiagnosisResult::QUESTION_COUNT + 1) },
      { brain_type: "Owl", answers: [ "Owl" ] * 5000 },
      { brain_type: "Owl" },
      { answers: ANSWERS }
    ]
    invalid_payloads.each do |payload|
      assert_no_difference("DiagnosisResult.count") { post results_url, params: payload, as: :json }
      assert_response :unprocessable_entity
    end
  end

  test "余計なパラメーターは無視され、IDなどを指定して保存することはできない" do
    post results_url, params: { brain_type: "Owl", answers: ANSWERS, id: 999, created_at: "2000-01-01" }, as: :json
    assert_response :created
    result = DiagnosisResult.last
    assert_not_equal 999, result.id
    assert result.created_at > 1.minute.ago
  end

  test "保存できるのは作成だけで、更新や削除のルートは存在しない" do
    patch "/results/1", params: { brain_type: "Owl" }
    assert_response :not_found
  end
end
