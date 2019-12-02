sum = 0
File.foreach('input.txt') do |line|
  sum += (line.chomp.to_i / 3).floor - 2
end

p sum
