class Post < ApplicationRecord
  belongs_to :user
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user
  has_many :comments, dependent: :destroy
  
  # Active Storage - 画像と動画（1ファイルのみ）
  has_one_attached :media_file
  
  # コンテンツまたはメディアファイルのどちらかが必須
  validates :content, length: { maximum: 1000 }
  validate :content_or_media_present
  validate :acceptable_media
  
  # 新しい順に並べる
  scope :recent, -> { order(created_at: :desc) }
  
  # ユーザーがいいねしているか確認
  def liked_by?(user)
    likes.exists?(user_id: user.id)
  end
  
  # コメントを最大10件取得（古い順）
  def recent_comments(limit = 10)
    comments.includes(:user).order(created_at: :asc).limit(limit)
  end
  
  private
  
  def content_or_media_present
    if content.blank? && !media_file.attached?
      errors.add(:base, '投稿内容または画像・動画を追加してください')
    end
  end
  
  def acceptable_media
    return unless media_file.attached?
    
    unless media_file.content_type.in?(['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'])
      errors.add(:media_file, 'は画像（JPEG, PNG, GIF）または動画（MP4, MOV）のみアップロード可能です')
    end
    
    if media_file.byte_size > 10.megabytes
      errors.add(:media_file, 'は10MB以下にしてください')
    end
  end
end