def calc_fuel(input)
  (input / 3).floor - 2
end

sum = 0

File.foreach('input.txt') do |line|
  temp_fuel = calc_fuel(line.chomp.to_i)
  total_fuel = temp_fuel

  while temp_fuel > 0
    temp_fuel = calc_fuel(temp_fuel)
    total_fuel += temp_fuel if temp_fuel > 0
  end
  
  sum += total_fuel
end

p sum
