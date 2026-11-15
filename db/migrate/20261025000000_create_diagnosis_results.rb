# 診断結果を匿名で保存するテーブル（個人を特定する情報は持たない）
class CreateDiagnosisResults < ActiveRecord::Migration[7.2]
  def change
    create_table :diagnosis_results do |t|
      # 結果の脳タイプ（Cheetah / Owl / Elephant / Dolphin）
      t.string :brain_type, null: false
      # 質問ごとの回答タイプ（7件の配列）
      t.json :answers, null: false

      t.timestamps
    end

    add_index :diagnosis_results, :brain_type
  end
end
