class CreateSchedules < ActiveRecord::Migration[8.0]
  def change
    create_table :schedules do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.string :location
      t.string :category
      t.text :memo

      t.timestamps
    end

    add_index :schedules, [ :user_id, :start_time ]
  end
end
