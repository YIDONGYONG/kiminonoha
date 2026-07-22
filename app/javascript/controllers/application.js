import { Application } from "@hotwired/stimulus"

// Stimulusアプリケーションインスタンスの初期化
const application = Application.start()

// 開発者エクスペリエンス（DX）の設定：デバッグモードの無効化
application.debug = false

// グローバルスコープへのStimulusインスタンスのバインド（デバッグや外部連携用）
window.Stimulus   = application

export { application }