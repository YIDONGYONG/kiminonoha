require "test_helper"

class BrainsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get brains_index_url
    assert_response :success
  end
end
