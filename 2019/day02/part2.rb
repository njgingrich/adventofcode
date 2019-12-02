require 'csv'

class Day2
  def initialize(desired)
    @initial_input = CSV.read('input.txt')[0].map{ |v| v.to_i }
    @input = @initial_input
    @step = 0

    output = 0
    (0..99).each do |noun|
      (0..99).each do |verb|
        result = self.run_with_input(noun, verb)
        p "result: #{result}"
        if result == desired
          "#{noun}, #{verb}"
          return
        end
      end
    end
  end

  def run_with_input(noun, verb)
    reset_input!
    p "running with noun=#{noun}, verb=#{verb}"
    @input[1] = noun
    @input[2] = verb

    self.run
  end

  def run
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
        break
      end
    
      @step += 4
    end
    
    @input[0]
  end

  private

  def reset_input!
    @input = @initial_input
  end

end

Day2.new(19690720)
