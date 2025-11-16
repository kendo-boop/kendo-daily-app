class CreateTeamMembers < ActiveRecord::Migration[8.0]
  def change
    create_table :team_members do |t|
      t.references :team_score, null: false, foreign_key: true
      t.string :position, null: false # 'senpo', 'jiho', 'chuken', 'fukusho', 'taisho', 'daihyosen'
      t.string :my_member_name, null: false
      t.string :opponent_member_name, null: false
      t.string :my_point_1
      t.string :my_point_2
      t.string :opponent_point_1
      t.string :opponent_point_2
      t.boolean :is_encho, default: false
      t.boolean :is_draw, default: false # 引き分けフラグ
      t.string :result # 'win', 'lose', 'draw'
      t.timestamps
    end
    
    add_index :team_members, [:team_score_id, :position]
  end
end
