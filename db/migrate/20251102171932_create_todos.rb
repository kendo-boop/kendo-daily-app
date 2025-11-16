class CreateTodos < ActiveRecord::Migration[8.0]
  def change
    create_table :todos do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.boolean :completed, default: false, null: false
      t.integer :priority, default: 0
      t.string :category
      t.date :due_date

      t.timestamps
    end

    add_index :todos, [:user_id, :completed]
  end
end
