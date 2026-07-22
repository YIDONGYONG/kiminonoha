class BrainProfile < ApplicationRecord
  self.primary_key = :brain_type

  serialize :keywords, coder: YAML, type: Array
  serialize :best_learning, coder: YAML, type: Array
  validates :brain_type, presence: true, uniqueness: true
end
