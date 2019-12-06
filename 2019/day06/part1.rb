require 'set'

class Planet
  attr_accessor :orbitee, :orbiters

  def initialize(name)
    @name = name
    @orbiters = Set.new
  end

  def distance_to_com
    return 0 if orbitee.nil?
    @distance_to_com ||= 1 + orbitee.distance_to_com
  end
end

class Day06
  attr_reader :planets

  def initialize
    @planets = {}

    File.foreach('input.txt') do |line|
      left, right = line.chomp.split(')')
      # p "#{left}:#{right}"

      orbitee = @planets[left] ||= Planet.new(left)
      orbiter = @planets[right] ||= Planet.new(right)
      orbiter.orbitee = orbitee
      orbitee.orbiters << orbiter
    end

    # p @planets
    p get_checksum
  end

  def get_root
    @planets.values.find{ |p| p.orbitee.nil? }
  end

  def get_checksum
    count_distance(get_root)
  end

  def count_distance(planet)
    planet.distance_to_com + planet.orbiters.map{ |p| count_distance(p) }.reduce(0, :+)
  end
end

Day06.new
