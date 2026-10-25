class ApplicationController < ActionController::Base
  # WebP画像・Web Push・バッジ・import maps・CSSネスト・:has に対応したモダンブラウザのみ許可する
  allow_browser versions: :modern
end
