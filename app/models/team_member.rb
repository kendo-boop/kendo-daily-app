class TeamMember < ApplicationRecord
  belongs_to :team_score

  POSITIONS = {
    "senpo" => "先鋒",
    "jiho" => "次鋒",
    "chuken" => "中堅",
    "fukusho" => "副将",
    "taisho" => "大将",
    "daihyosen" => "代表戦"
  }.freeze

  POINTS = {
    "men" => "メ",
    "kote" => "コ",
    "do" => "ド",
    "tsuki" => "ツ"
  }.freeze

  # バリデーションを緩和（空文字列を許可）
  validates :position, presence: true
  validates :position, inclusion: { in: POSITIONS.keys }
  # my_member_name と opponent_member_name は presence: true を削除

  # 残りのコードはそのまま
  def points_history
    return [] if self[:points_history].blank?

    parsed = self[:points_history].is_a?(String) ? JSON.parse(self[:points_history]) : self[:points_history]
    parsed.is_a?(Array) ? parsed : []
  rescue JSON::ParserError
    []
  end

  def points_history=(value)
    if value.is_a?(String)
      self[:points_history] = value
    elsif value.is_a?(Array)
      self[:points_history] = value.to_json
    else
      self[:points_history] = [].to_json
    end
  end

  def my_points
    points_history.select { |p| p["player"] == "my" }.map { |p| p["point"] }
  end

  def opponent_points
    points_history.select { |p| p["player"] == "opponent" }.map { |p| p["point"] }
  end

  def my_point_count
    my_points.size
  end

  def opponent_point_count
    opponent_points.size
  end

  def add_point(player, point, is_first: false)
    history = points_history
    history << {
      "player" => player,
      "point" => point,
      "is_first" => is_first
    }
    self.points_history = history
  end

  def first_point
    points_history.find { |p| p["is_first"] }
  end

  def win?
    result == "win"
  end

  def lose?
    result == "lose"
  end

  def draw?
    is_draw || result == "draw"
  end

  def display_point(point)
    POINTS[point] || point
  end

  def position_name
    POSITIONS[position] || position
  end
end
