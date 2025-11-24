class Profile < ApplicationRecord
  belongs_to :user
  has_one_attached :avatar
  after_initialize :set_defaults, if: :new_record?

  private

  def set_defaults
    self.name ||= "未設定"
    self.bio ||= ""
  end
end
