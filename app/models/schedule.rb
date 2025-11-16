class Schedule < ApplicationRecord
  belongs_to :user
  
  # カテゴリの定義
  CATEGORIES = ['稽古', '大会', '審査', '講習会', 'その他'].freeze
  
  # バリデーション
  validates :title, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :category, inclusion: { in: CATEGORIES }, allow_blank: true
  validate :end_time_after_start_time
  
  # スコープ
  scope :ordered, -> { order(start_time: :asc) }
  scope :for_date, ->(date) { 
    where(start_time: date.beginning_of_day..date.end_of_day) 
  }
  scope :for_month, ->(year, month) {
    start_date = Date.new(year, month, 1)
    end_date = start_date.end_of_month
    where(start_time: start_date.beginning_of_day..end_date.end_of_day)
  }
  
  private
  
  def end_time_after_start_time
    return if end_time.blank? || start_time.blank?
    
    if end_time <= start_time
      errors.add(:end_time, "は開始時刻より後に設定してください")
    end
  end
end