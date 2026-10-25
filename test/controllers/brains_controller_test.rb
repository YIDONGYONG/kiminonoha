require "test_helper"

class BrainsControllerTest < ActionDispatch::IntegrationTest
  test "トップページが表示される" do
    get root_url
    assert_response :success
    assert_select "title", /君の脳/
  end

  test "診断用の質問とプロフィールがページに埋め込まれる" do
    get root_url
    assert_select "[data-controller='brain-quiz']"
    assert_includes response.body, "あなたの行動スタイルは？"
    assert_includes response.body, "チーター"
  end

  test "ヘッダーに主要ページへのリンクがある" do
    get root_url
    assert_select "header a[href='#{brain_types_path}']"
    assert_select "header a[href='#{guide_path}']"
  end
end
