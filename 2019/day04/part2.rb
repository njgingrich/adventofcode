class Day04
  def initialize(min, max)
    count = 0
    (min..max).each do |num|
      satisfies = satisfies_rules(num)
      count += 1 if satisfies
    end

    p count
  end

  def satisfies_rules(num)
    numArray = num.to_s.split('').map(&:to_i)
    previous = -1
    sameAdjacent = 1
    numRepeats = []

    numArray.each do |num|
      # decreasing digit, fail early
      if num < previous
        return false
      # found a pair
      elsif num == previous
        sameAdjacent += 1
      else
        numRepeats.push(sameAdjacent)
        sameAdjacent = 1
      end

      previous = num
    end

    numRepeats.push(sameAdjacent)
    return numRepeats.find{ |v| v == 2 }
  end
end

Day04.new(136760, 595730)
