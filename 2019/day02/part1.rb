require 'csv'

class Day2
  def initialize
    @input = CSV.read('input.txt')[0].map{ |v| v.to_i }
    @step = 0

    self.run
  end

  def run
    reset_input!

    @input.each do |code|
      opcode = @input[@step]
    
      if opcode == 1
        a = @input[@input[@step + 1]]
        b = @input[@input[@step + 2]]
        outIx = @input[@step + 3]
        @input[outIx] = a + b
      elsif opcode == 2
        a = @input[@input[@step + 1]]
        b = @input[@input[@step + 2]]
        outIx = @input[@step + 3]
        @input[outIx] = a * b
      elsif opcode == 99
        p @input[0]
        break
      end
    
      @step += 4
    end
    
  end

  private

  def reset_input!
    @input[1] = 12
    @input[2] = 2
  end

end

Day2.new
