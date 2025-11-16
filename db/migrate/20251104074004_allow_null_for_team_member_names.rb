class AllowNullForTeamMemberNames < ActiveRecord::Migration[8.0]
  def change
    # team_membersの名前フィールドをnull許可に変更
    change_column_null :team_members, :my_member_name, true
    change_column_null :team_members, :opponent_member_name, true
    
    # team_scoresの名前フィールドもnull許可に変更
    change_column_null :team_scores, :my_team_name, true
    change_column_null :team_scores, :opponent_team_name, true
    
    # individual_scoresの名前フィールドもnull許可に変更
    change_column_null :individual_scores, :opponent_name, true
  end
end