class SitemapsController < ApplicationController
  def show
    @paths = [ root_path, guide_path, brain_types_path ]
    @paths += BrainTypeContent.all.keys.map { |key| brain_type_path(key.downcase) }
    respond_to { |format| format.xml }
  end

  def robots
    render plain: <<~TXT
      User-agent: *
      Allow: /

      Sitemap: #{sitemap_url}
    TXT
  end
end
