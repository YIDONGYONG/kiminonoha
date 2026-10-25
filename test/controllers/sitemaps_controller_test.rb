require "test_helper"

class SitemapsControllerTest < ActionDispatch::IntegrationTest
  test "サイトマップに全ページが含まれる" do
    get sitemap_url
    assert_response :success
    assert_includes response.body, brain_types_url
    assert_includes response.body, brain_type_url("owl")
    assert_includes response.body, guide_url
  end

  test "robots.txtにサイトマップの場所が書かれている" do
    get "/robots.txt"
    assert_response :success
    assert_includes response.body, "Sitemap: #{sitemap_url}"
  end
end
