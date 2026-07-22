class BrainsController < ApplicationController
  def index
    @questions = Question.includes(:options).all
    @brain_profiles = BrainProfile.all
  end
end
