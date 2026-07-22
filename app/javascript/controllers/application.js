import { Application } from "@hotwired/stimulus"

<<<<<<< HEAD
// Stimulusアプリケーションインスタンスの初期化
const application = Application.start()

// 開発者エクスペリエンス（DX）の設定：デバッグモードの無効化
application.debug = false

// グローバルスコープへのStimulusインスタンスのバインド（デバッグや外部連携用）
window.Stimulus   = application

export { application }
=======
const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }
>>>>>>> 5caed5f9d91bb46f43d9158e070a08056a9814a6
