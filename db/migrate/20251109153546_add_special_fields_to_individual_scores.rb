class AddSpecialFieldsToIndividualScores < ActiveRecord::Migration[8.0]
  def change

    add_column :individual_scores, :is_draw, :boolean, default: false unless column_exists?(:individual_scores, :is_draw)
  end
end