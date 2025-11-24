class CreateTeamScores < ActiveRecord::Migration[8.0]
  def change
    create_table :team_scores do |t|
      t.references :match, null: false, foreign_key: true
      t.string :my_team_name, null: false
      t.string :opponent_team_name, null: false
      t.string :result, null: false # 'win', 'lose'
      t.boolean :has_daihyosen, default: false # 代表戦フラグ
      t.timestamps
    end
  end
end
