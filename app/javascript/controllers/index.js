// このファイルは ./bin/rails stimulus:manifest:update で自動生成されます
// コントローラーを追加したとき、または
// ./bin/rails generate stimulus controllerName で作成したときは、このコマンドを実行してください

import { application } from "./application"

import BrainQuizController from "./brain_quiz_controller"
application.register("brain-quiz", BrainQuizController)

import HelloController from "./hello_controller"
application.register("hello", HelloController)
