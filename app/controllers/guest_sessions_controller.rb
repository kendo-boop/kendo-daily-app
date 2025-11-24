class GuestSessionsController < ApplicationController
  def create
    user = User.guest
    sign_in user
    redirect_to root_path, notice: "ゲストユーザーとしてログインしました"
  end
end
