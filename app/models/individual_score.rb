class IndividualScore < ApplicationRecord
  belongs_to :match

  validates :result, presence: true
  validates :result, inclusion: { in: %w[win lose] }

  POINTS = {
    "men" => "メ",
    "kote" => "コ",
    "do" => "ド",
    "tsuki" => "ツ"
  }.freeze

  # points_historyをJSONとして扱う
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

  # 自分の技一覧を取得
  def my_points
    points_history.select { |p| p["player"] == "my" }.map { |p| p["point"] }
  end

  # 相手の技一覧を取得
  def opponent_points
    points_history.select { |p| p["player"] == "opponent" }.map { |p| p["point"] }
  end

  # 自分の本数
  def my_point_count
    my_points.size
  end

  # 相手の本数
  def opponent_point_count
    opponent_points.size
  end

  # 技を追加（順序を保持）
  def add_point(player, point, is_first: false)
    history = points_history
    history << {
      "player" => player,
      "point" => point,
      "is_first" => is_first
    }
    self.points_history = history
  end

  # 最初の技を取得
  def first_point
    points_history.find { |p| p["is_first"] }
  end

  def win?
    result == "win"
  end

  def lose?
    result == "lose"
  end

  def display_point(point)
    POINTS[point] || ""
  end

  # 新規追加: デフォルト値を返すメソッド
  def is_draw
    self[:is_draw] || false
  end

  def is_encho
    self[:is_encho] || false
  end

  def is_fusenshow
    self[:is_fusenshow] || false
  end

  def is_hantei
    self[:is_hantei] || false
  end

  def hansoku_count_my
    self[:hansoku_count_my] || 0
  end

  def hansoku_count_opponent
    self[:hansoku_count_opponent] || 0
  end
end
