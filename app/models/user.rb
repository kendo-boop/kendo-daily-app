class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  has_one :profile, dependent: :destroy
  has_many :todos, dependent: :destroy
  has_many :schedules, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_posts, through: :likes, source: :post
  has_many :comments, dependent: :destroy
  has_many :matches, dependent: :destroy

  # プロフィール画像
  has_one_attached :avatar

  # ゲストユーザーを作成または取得
  def self.guest
    find_or_create_by!(email: "guest@example.com") do |user|
      user.password = SecureRandom.urlsafe_base64
      user.skip_confirmation! # メール確認をスキップ
    end
  end

  after_create { create_profile! unless profile }
end
