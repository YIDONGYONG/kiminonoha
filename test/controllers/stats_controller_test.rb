require "test_helper"

class StatsControllerTest < ActionDispatch::IntegrationTest
  ANSWERS = %w[Owl Owl Cheetah Owl Elephant Owl Dolphin].freeze

  def create_results(count, type)
    count.times { DiagnosisResult.create!(brain_type: type, answers: ANSWERS) }
  end

  test "件数が少ないうちは集計を表示しない" do
    create_results(DiagnosisResult::MIN_PUBLIC_COUNT - 1, "Owl")
    get stats_url
    assert_response :success
    assert_select "p", /集計はまだ準備中/
    assert_select "[style*='width']", 0
  end

  test "件数が十分なら分布と学習のヒントを表示する" do
    create_results(3, "Owl")
    create_results(2, "Cheetah")
    get stats_url
    assert_response :success
    assert_select "[style*='width: 60%']"
    assert_select "h2", /フクロウ/
  end
end
