require "test_helper"

# 公開前の基本的なセキュリティ確認
class SecurityTest < ActionDispatch::IntegrationTest
  test "集計は件数が少ないあいだ、件数や分布を一切返さない" do
    (DiagnosisResult::MIN_PUBLIC_COUNT - 1).times do
      DiagnosisResult.create!(brain_type: "Owl", answers: [ "Owl" ] * DiagnosisResult::QUESTION_COUNT)
    end
    get stats_url
    assert_no_match(/\d+件\s*\)/, response.body.sub(/全体の集計（\d+件）/, ""))
    assert_select "[style*='width']", 0
  end

  test "結果の一覧取得・更新・削除はできない" do
    get "/results"
    assert_response :not_found
    delete "/results/1"
    assert_response :not_found
  end

  test "ユーザー入力のグループ名やタイプ名でHTMLが挿入されない" do
    get brain_type_url("<script>alert(1)</script>")
    assert_response :not_found
    assert_not_includes response.body, "<script>alert(1)</script>"
  end
end
