fun main(args: Array<String>) {
  val input = 312051
  val sqrt = Math.sqrt(input.toDouble()).toInt()
  val dim = if (sqrt % 2 == 0) sqrt + 1 else sqrt + 2
  val coord = spiral(dim).get(input - 1)
  println(Math.abs(coord.first) + Math.abs(coord.second))
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
