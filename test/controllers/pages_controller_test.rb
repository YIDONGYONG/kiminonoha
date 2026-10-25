require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "診断ガイドが表示される" do
    get guide_url
    assert_response :success
    assert_select "h1", /診断の仕組み/
  end

  test "削除済みのページは存在しない" do
    %w[/about /contact /privacy /terms].each do |path|
      get path
      assert_response :not_found
    end
  end
end
