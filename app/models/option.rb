class Option < ApplicationRecord
  belongs_to :question
  # brain_type은 'Cheetah', 'Owl', 'Elephant', 'Dolphin' 중 하나
end
