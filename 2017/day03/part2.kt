fun main(args: Array<String>) {
  val input = 312051
  val coords = spiral(8) // yay for hardcoding
  var map = coords.mapIndexed{ i, v -> Pair(v, i) }
  var sums = IntArray(map.size)
    
  map.forEachIndexed{ i, pair ->
    var validNeighbors = neighbors(pair.first).filter{ coords.subList(0, i).contains(it) }
    var previousCount = if (validNeighbors.isEmpty()) {
      1 
    } else {
      validNeighbors.map{ sums[map.first{ coord -> coord.first == it }.second] }.sum()
    }
    sums[i] = previousCount
  }
  println(sums.first{ it > input })
}

fun spiral(dim: Int): List<Pair<Int, Int>> {
  var x: Int = 0 
  var y: Int = 0
  var dx: Int = 0
  var dy: Int = -1
  var coords = mutableListOf<Pair<Int, Int>>()

  for (i in 2..Math.pow(dim.toDouble(), 2.toDouble()).toInt()) {
    if (x == 0 && y == 0) {
      coords.add(Pair(x, y))
    }
    if (x == y || (x < 0 && x == -y) || (x > 0 && x == 1-y)) {
      dx = -dy.also { dy = dx }
    }
    x += dx
    y += dy
    coords.add(Pair(x, y))
  }
  return coords
}

fun neighbors(coord: Pair<Int, Int>): List<Pair<Int, Int>> {
  var list = mutableListOf<Pair<Int, Int>>()
  for (i in -1..1) {
    for (j in -1..1) {
      list.add(Pair(coord.first + j, coord.second - i))
    }
  }
  return list
}
