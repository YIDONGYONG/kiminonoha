class BrainTypesController < ApplicationController
  def index
    @contents = BrainTypeContent.all
  end

  def show
    @key, @content = BrainTypeContent.find(params[:id])
    raise ActionController::RoutingError, "Not Found" unless @content
  end
end
