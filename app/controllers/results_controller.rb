# 診断結果を匿名で受け取って保存するJSON API
class ResultsController < ApplicationController
  # 連打や悪用を防ぐため、1分あたりの保存回数を制限する
  rate_limit to: 30, within: 1.minute, only: :create

  def create
    result = DiagnosisResult.new(result_params)
    if result.save
      head :created
    else
      render json: { errors: result.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def result_params
    params.permit(:brain_type, answers: [])
  end
end
