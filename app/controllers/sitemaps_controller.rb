class SitemapsController < ApplicationController
  def show
    @paths = [ root_path, guide_path, brain_types_path, stats_path, privacy_path ]
    @paths += BrainTypeContent.all.keys.map { |key| brain_type_path(key.downcase) }
    respond_to { |format| format.xml }
  end

  # 限定公開（NOINDEX）のときはサイトマップを案内しない。
  # robots.txt で全体を拒否すると、SNSのリンクプレビュー用クローラーも弾いてしまうため Allow のままにする
  def robots
    lines = [ "User-agent: *", "Allow: /" ]
    lines += [ "", "Sitemap: #{sitemap_url}" ] unless ENV["NOINDEX"] == "true"
    render plain: lines.join("\n") + "\n"
  end
end
