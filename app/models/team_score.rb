class TeamScore < ApplicationRecord
  belongs_to :match
  has_many :team_members, dependent: :destroy
  
  validates :result, presence: true
  validates :result, inclusion: { in: %w[win lose draw] }  # drawを追加
  
  accepts_nested_attributes_for :team_members, allow_destroy: true
  
  def win?
    result == 'win'
  end
  
  def lose?
    result == 'lose'
  end
  
  def draw?
    result == 'draw'
  end
  
  # 自チームの本数
  def my_total_points
    team_members.sum { |tm| tm.my_point_count }
  end
  
  # 相手チームの本数
  def opponent_total_points
    team_members.sum { |tm| tm.opponent_point_count }
  end
  
  # 自チームの勝者数
  def my_win_count
    team_members.count { |tm| tm.win? }
  end
  
  # 相手チームの勝者数
  def opponent_win_count
    team_members.count { |tm| tm.lose? }
  end
  
  # 自動で勝敗を計算（改善版）
  def calculate_result!
    my_wins = my_win_count
    opponent_wins = opponent_win_count
    
    if my_wins > opponent_wins
      self.result = 'win'
    elsif opponent_wins > my_wins
      self.result = 'lose'
    else
      # 勝者数が同じ場合は本数で判定
      my_points = my_total_points
      opponent_points = opponent_total_points
      
      if my_points > opponent_points
        self.result = 'win'
      elsif opponent_points > my_points
        self.result = 'lose'
      else
        # 本数も同じ場合
        if has_daihyosen
          # 代表戦が行われた場合は、代表戦メンバーの結果で判定
          daihyosen_member = team_members.find_by(position: 'daihyosen')
          if daihyosen_member
            self.result = daihyosen_member.win? ? 'win' : 'lose'
          else
            self.result = 'draw'  # 代表戦メンバーがいない場合は引き分け
          end
        else
          self.result = 'draw'  # トーナメントでない場合は引き分け
        end
      end
    end
    
    save
  end
end