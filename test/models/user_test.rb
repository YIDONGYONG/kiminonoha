require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "ユーザーを保存できる" do
    assert User.create(name: "テスト").persisted?
  end
end
