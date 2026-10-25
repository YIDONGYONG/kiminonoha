class Option < ApplicationRecord
  belongs_to :question
  # brain_typeは 'Cheetah'、'Owl'、'Elephant'、'Dolphin' のいずれか
end
