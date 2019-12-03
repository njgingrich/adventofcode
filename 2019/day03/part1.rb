require 'csv'

class Day3
  def initialize
    @lines = CSV.read('input.txt')
    points = @lines.map{ |line| self.get_points(line) }
    intersecting = self.intersection(points)
    closest =  self.find_closest(intersecting)
    p self.get_distance(closest)
  end

  def get_distance(point)
    point[0].abs + point[1].abs
  end

  def find_closest(points)
    points.sort_by { |val| self.get_distance(val) }.first
  end

  def intersection(points)
    points[0] & points[1]
  end

  def get_points(line)
    points = []
    loc = [0, 0]

    line.each do |move|
      (1..move[1..-1].to_i).each do |v|
        case move[0]
        when 'L'
          loc = [loc[0] - 1, loc[1]]
        when 'R'
          loc = [loc[0] + 1, loc[1]]
        when 'U'
          loc = [loc[0], loc[1] + 1]
        when 'D'
          loc = [loc[0], loc[1] - 1]
        end

        points.push(loc)
      end
    end

    points
  end

end

Day3.new
