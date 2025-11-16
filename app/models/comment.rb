class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :post, counter_cache: true
  
  validates :content, presence: true, length: { maximum: 500 }
  
  # 新しい順に並べる
  scope :recent, -> { order(created_at: :desc) }
  
  # 古い順に並べる（表示用）
  scope :oldest_first, -> { order(created_at: :asc) }
end