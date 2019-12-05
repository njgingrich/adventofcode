require 'csv'

class Mode
  POSITION = 0
  IMMEDIATE = 1
end

class Instruction
  def initialize(instruction)
    instruction = instruction.to_s.rjust(5, '0')
    @opcode = instruction[3..4].to_i
    @param1Mode = instruction[2].to_i
    @param2Mode = instruction[1].to_i
    @param3Mode = instruction[0].to_i
  end
  attr_reader :opcode, :param1Mode, :param2Mode, :param3Mode
end

class Day5
  OP_PARAMS = [-1, 3, 3, 1, 1]

  def initialize
    @initial_input = CSV.read('input.txt')[0].map{ |v| v.to_i }
    @input = @initial_input.dup
    @step = 0

    self.run
  end

  def run
    reset!

    @input.each do |code|
      instruction = get_instruction
    
      case instruction.opcode
      when 1
        a = param_value(@step + 1, instruction.param1Mode)
        b = param_value(@step + 2, instruction.param2Mode)
        outIx = @input[@step + 3]
        @input[outIx] = a + b
      when 2
        a = param_value(@step + 1, instruction.param1Mode)
        b = param_value(@step + 2, instruction.param2Mode)
        outIx = @input[@step + 3]
        @input[outIx] = a * b
      when 3
        outIx = @input[@step + 1]
        # we only provide input once, and for part 1 it is 1
        @input[outIx] = 1

      when 4
        outIx = @input[@step + 1]
        p @input[outIx]

      when 99
        break
      else
        raise "Unknown opcode"
        break
      end

      @step += OP_PARAMS[instruction.opcode] + 1
    end
  end

  private

  def get_instruction
    Instruction.new(@input[@step])
  end

  def param_value(param, mode)
    if mode == Mode::IMMEDIATE
      @input[param]
    elsif mode == Mode::POSITION
      @input[@input[param]]
    else
      raise "Unknown parameter mode"
    end
  end

  def reset!
    @input = @initial_input.dup
    @step = 0
  end

end

Day5.new
