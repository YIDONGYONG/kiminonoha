class CreateBrainProfiles < ActiveRecord::Migration[7.2]
  def change
    create_table :brain_profiles do |t|
      t.string :brain_type
      t.string :title
      t.string :subtitle
      t.string :color
      t.string :bg_color
      t.string :gradient_from
      t.string :gradient_to
      t.string :emoji
      t.string :image_url
      t.text :keywords
      t.text :description
      t.text :best_learning
      t.string :worst_learning
      t.string :daily_mission

      t.timestamps
    end
  end
end
