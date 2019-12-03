require 'csv'

class Day2
  def initialize(desired)
    @desired = desired
    @initial_input = CSV.read('input.txt')[0].map{ |v| v.to_i }
    @input = @initial_input.dup
    @step = 0

    p self.find_output(0, 99)
  end

  def find_output(min, max)
    (min..max).each do |noun|
      (min..max).each do |verb|
        result = self.run_with_input(noun, verb)
        if result == @desired
          return (100 * noun) + verb
        end
      end
    end
    return -1
  end

  def run_with_input(noun, verb)
    reset!
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

  def reset!
    @input = @initial_input.dup
    @step = 0
  end

end

Day2.new(19690720)
