class AddTeamNamesToIndividualScores < ActiveRecord::Migration[8.0]
  def change
    add_column :individual_scores, :my_team_name, :string
    add_column :individual_scores, :opponent_team_name, :string
  end
end
