require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "診断ガイドが表示される" do
    get guide_url
    assert_response :success
    assert_select "h1", /診断の仕組み/
  end

  test "プライバシーのお知らせが表示される" do
    get privacy_url
    assert_response :success
    assert_select "h1", /プライバシー/
  end

  test "削除済みのページは存在しない" do
    %w[/about /contact /terms].each do |path|
      get path
      assert_response :not_found
    end
  end
end
