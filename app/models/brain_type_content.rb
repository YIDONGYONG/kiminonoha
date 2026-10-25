# 脳タイプごとの解説記事（config/brain_type_contents.yml）を読み込む
class BrainTypeContent
  PATH = Rails.root.join("config/brain_type_contents.yml")

  def self.all
    @all ||= YAML.safe_load_file(PATH).freeze
  end

  def self.find(slug)
    all.find { |key, _| key.downcase == slug.to_s.downcase }
  end
end
