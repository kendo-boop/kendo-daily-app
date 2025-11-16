require "test_helper"

class ShowControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get show_edit_url
    assert_response :success
  end

  test "should get update" do
    get show_update_url
    assert_response :success
  end
end
