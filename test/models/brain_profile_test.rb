require "test_helper"

class BrainProfileTest < ActiveSupport::TestCase
  test "フィクスチャが有効である" do
    assert BrainProfile.all.all?(&:valid?)
  end

  test "brain_typeは必須" do
    assert_not BrainProfile.new(brain_type: nil).valid?
  end

  test "brain_typeは重複できない" do
    assert_not BrainProfile.new(brain_type: "Cheetah").valid?
  end

  test "keywordsは配列として読み込まれる" do
    assert_equal %w[スピード 直感], brain_profiles(:cheetah).keywords
  end
end
