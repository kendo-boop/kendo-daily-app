class SetDefaultValuesForNames < ActiveRecord::Migration[8.0]
  def change
    # デフォルト値を空文字列に設定
    change_column_default :team_members, :my_member_name, from: nil, to: ''
    change_column_default :team_members, :opponent_member_name, from: nil, to: ''
    change_column_default :team_scores, :my_team_name, from: nil, to: ''
    change_column_default :team_scores, :opponent_team_name, from: nil, to: ''
    change_column_default :individual_scores, :opponent_name, from: nil, to: ''

    # 既存のnullデータを空文字列に更新
    TeamMember.where(my_member_name: nil).update_all(my_member_name: '')
    TeamMember.where(opponent_member_name: nil).update_all(opponent_member_name: '')
    TeamScore.where(my_team_name: nil).update_all(my_team_name: '')
    TeamScore.where(opponent_team_name: nil).update_all(opponent_team_name: '')
    IndividualScore.where(opponent_name: nil).update_all(opponent_name: '')
  end
end
