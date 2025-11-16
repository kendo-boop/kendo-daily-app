class CreateIndividualScores < ActiveRecord::Migration[8.0]
  def change
    create_table :individual_scores do |t|
      t.references :match, null: false, foreign_key: true
      t.string :my_name, null: false
      t.string :opponent_name, null: false
      t.string :my_point_1 # 'men', 'kote', 'do', 'tsuki'
      t.string :my_point_2
      t.string :opponent_point_1
      t.string :opponent_point_2
      t.boolean :is_encho, default: false # 延長フラグ
      t.string :result, null: false # 'win', 'lose'
      t.timestamps
    end
  end
end