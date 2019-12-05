require 'csv'

class Mode
  POSITION = 0
  IMMEDIATE = 1
end

class Op
  ADD = 1
  MULT = 2
  INPUT = 3
  OUTPUT = 4
  JUMP_IF_TRUE = 5
  JUMP_IF_FALSE = 6
  LESS_THAN = 7
  EQUALS = 8
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
  OP_PARAMS = [-1, 3, 3, 1, 1, 2, 2, 3, 3]

  def initialize(input)
    @DEBUG = false

    @initial_input = CSV.read('input.txt')[0].map{ |v| v.to_i }
    @input = input
    @program = @initial_input.dup
    @step = 0

    self.run
  end

  def run
    reset!
    @program.each do |code|
      instruction = get_instruction
      log "step: #{@step} = #{@program[@step]}"
      log @program
    
      case instruction.opcode
      when Op::ADD
        a = param_value(@step + 1, instruction.param1Mode)
        b = param_value(@step + 2, instruction.param2Mode)
        outIx = @program[@step + 3]
        @program[outIx] = a + b
      when Op::MULT
        a = param_value(@step + 1, instruction.param1Mode)
        b = param_value(@step + 2, instruction.param2Mode)
        outIx = @program[@step + 3]
        @program[outIx] = a * b
      when Op::INPUT
        outIx = @program[@step + 1]
        log "IN: ix=#{outIx}, val=#{@input}"
        @program[outIx] = @input
      when Op::OUTPUT
        output = param_value(@step + 1, instruction.param1Mode)
        log "OUT: #{output}"
        p output
      when Op::JUMP_IF_TRUE
        a = param_value(@step + 1, instruction.param1Mode)
        b = param_value(@step + 2, instruction.param2Mode)
        log "JIT: #{a}, #{b}"
        if a != 0
          @step = b
        else
          @step += OP_PARAMS[instruction.opcode] + 1
        end
      when Op::JUMP_IF_FALSE
        a = param_value(@step + 1, instruction.param1Mode)
        b = param_value(@step + 2, instruction.param2Mode)
        log "JIF: #{a}, #{b}"
        if a == 0
          @step = b
        else
          @step += OP_PARAMS[instruction.opcode] + 1
        end
      when Op::LESS_THAN
        a = param_value(@step + 1, instruction.param1Mode)
        b = param_value(@step + 2, instruction.param2Mode)
        outIx = @program[@step + 3]
        log "LT: #{a}, #{b}"
        @program[outIx] = a < b ? 1 : 0
      when Op::EQUALS
        a = param_value(@step + 1, instruction.param1Mode)
        b = param_value(@step + 2, instruction.param2Mode)
        outIx = @program[@step + 3]
        log "EQ: #{a}, #{b}"
        @program[outIx] = a == b ? 1 : 0
      when 99
        break
      else
        raise "Unknown opcode: #{instruction.opcode}"
        break
      end

      # jump if true/false already set the step
      if !([Op::JUMP_IF_TRUE, Op::JUMP_IF_FALSE].include?(instruction.opcode))
        @step += OP_PARAMS[instruction.opcode] + 1
      end

      log "New step: #{@step}"
    end
  end

  private

  def get_instruction
    Instruction.new(@program[@step])
  end

  def param_value(param, mode)
    if mode == Mode::IMMEDIATE
      @program[param]
    elsif mode == Mode::POSITION
      @program[@program[param]]
    else
      raise "Unknown parameter mode"
    end
  end

  def reset!
    @program = @initial_input.dup
    @step = 0
  end

  def log(message)
    return if !@DEBUG
    p message
  end
end

input = (ARGV[0] || 1).to_i
Day5.new(input)
