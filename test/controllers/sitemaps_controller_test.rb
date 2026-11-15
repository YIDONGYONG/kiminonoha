require "test_helper"

class SitemapsControllerTest < ActionDispatch::IntegrationTest
  test "サイトマップに全ページが含まれる" do
    get sitemap_url
    assert_response :success
    assert_includes response.body, brain_types_url
    assert_includes response.body, brain_type_url("owl")
    assert_includes response.body, guide_url
    assert_includes response.body, stats_url
  end

  test "robots.txtにサイトマップの場所が書かれている" do
    get "/robots.txt"
    assert_response :success
    assert_includes response.body, "Sitemap: #{sitemap_url}"
  end

  test "NOINDEX指定のときはサイトマップを案内せず、noindexのmetaを出す" do
    ENV["NOINDEX"] = "true"
    get "/robots.txt"
    assert_not_includes response.body, "Sitemap:"
    assert_includes response.body, "Allow: /"
    get root_url
    assert_select "meta[name='robots'][content='noindex, nofollow']"
  ensure
    ENV.delete("NOINDEX")
  end

  test "NOINDEX未指定のときはnoindexのmetaを出さない" do
    get root_url
    assert_select "meta[name='robots']", 0
  end
end
