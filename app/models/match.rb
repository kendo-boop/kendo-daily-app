class Match < ApplicationRecord
  belongs_to :user
  has_one :individual_score, dependent: :destroy
  has_one :team_score, dependent: :destroy

  # ネストされた属性を受け付ける
  accepts_nested_attributes_for :individual_score
  accepts_nested_attributes_for :team_score

  validates :match_type, presence: true, inclusion: { in: %w[individual team] }
  validates :title, presence: true
  validates :match_date, presence: true

  scope :recent, -> { order(match_date: :desc, created_at: :desc) }
  scope :individual, -> { where(match_type: "individual") }
  scope :team, -> { where(match_type: "team") }

  def individual?
    match_type == "individual"
  end

  def team?
    match_type == "team"
  end

  def score
    individual? ? individual_score : team_score
  end
end