Rails.application.routes.draw do
  # ルーティング定義のDSLについては https://guides.rubyonrails.org/routing.html を参照

  # /up はアプリが例外なく起動していれば200、そうでなければ500を返すヘルスチェック
  # ロードバランサーや死活監視から生存確認に利用できる
  get "up" => "rails/health#show", as: :rails_health_check

  # app/views/pwa/* から動的にPWAファイルを返す
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # ルートパス（"/"）：脳タイプ診断
  root "brains#index"

  # 診断ガイド
  get "guide", to: "pages#guide"

  # 脳タイプの解説（一覧・詳細）
  resources :brain_types, path: "types", only: %i[index show]

  # 検索エンジン向け（サイトマップ・robots.txt）
  get "sitemap.xml", to: "sitemaps#show", defaults: { format: :xml }, as: :sitemap
  get "robots.txt", to: "sitemaps#robots"
end
