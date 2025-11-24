class ImproveScoreTracking < ActiveRecord::Migration[8.0]
  def change
    # TeamMembersテーブルの修正
    remove_column :team_members, :my_point_1, :string
    remove_column :team_members, :my_point_2, :string
    remove_column :team_members, :opponent_point_1, :string
    remove_column :team_members, :opponent_point_2, :string

    # 新しいカラムを追加
    add_column :team_members, :points_history, :text
    add_column :team_members, :is_fusenshow, :boolean, default: false
    add_column :team_members, :hansoku_count_my, :integer, default: 0
    add_column :team_members, :hansoku_count_opponent, :integer, default: 0
    add_column :team_members, :is_hantei, :boolean, default: false

    # IndividualScoresテーブルも同様に修正
    remove_column :individual_scores, :my_point_1, :string
    remove_column :individual_scores, :my_point_2, :string
    remove_column :individual_scores, :opponent_point_1, :string
    remove_column :individual_scores, :opponent_point_2, :string

    add_column :individual_scores, :points_history, :text
    add_column :individual_scores, :is_fusenshow, :boolean, default: false
    add_column :individual_scores, :hansoku_count_my, :integer, default: 0
    add_column :individual_scores, :hansoku_count_opponent, :integer, default: 0
    add_column :individual_scores, :is_hantei, :boolean, default: false
  end
end
