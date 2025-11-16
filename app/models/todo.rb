class Todo < ApplicationRecord
  belongs_to :user

  # バリデーション
  validates :title, presence: true, length: { maximum: 255 }

  # スコープ
  scope :completed, -> { where(completed: true) }
  scope :incomplete, -> { where(completed: false) }
  scope :ordered, -> { order(completed: :asc, priority: :desc, created_at: :desc) }

  # カテゴリの定数
  CATEGORIES = ["技術", "体力", "精神", "道具", "その他"].freeze
end