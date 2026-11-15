require "test_helper"

class BrainTypesControllerTest < ActionDispatch::IntegrationTest
  test "脳タイプ一覧に4タイプが表示される" do
    get brain_types_url
    assert_response :success
    assert_select "a[href^='/types/']", 4
  end

  test "各タイプの詳細ページが表示される" do
    %w[cheetah owl elephant dolphin].each do |slug|
      get brain_type_url(slug)
      assert_response :success
      assert_select "h1"
      assert_select "meta[name='description']"
    end
  end

  test "強調記法が太字に変換される" do
    get brain_type_url("cheetah")
    assert_select "strong"
    assert_not_includes response.body, "**"
  end

  test "共有用の結果画像（OGP）が脳タイプごとに設定される" do
    get brain_type_url("owl")
    assert_select "meta[property='og:image'][content$='/characters/result-owl.png']"
    assert_select "meta[name='twitter:card'][content='summary_large_image']"
    %w[cheetah owl elephant dolphin].each do |slug|
      assert Rails.public_path.join("characters", "result-#{slug}.png").exist?
    end
  end

  test "存在しないタイプは404になる" do
    get brain_type_url("unknown")
    assert_response :not_found
  end
end
