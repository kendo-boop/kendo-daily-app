class CreateMatches < ActiveRecord::Migration[8.0]
  def change
    create_table :matches do |t|
      t.references :user, null: false, foreign_key: true
      t.string :match_type, null: false # 'individual' or 'team'
      t.string :title, null: false
      t.date :match_date, null: false
      t.string :location
      t.text :memo
      t.timestamps
    end
    
    add_index :matches, [:user_id, :match_date]
  end
end