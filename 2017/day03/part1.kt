fun main(args: Array<String>) {
  val input = 312051
  val sqrt = Math.sqrt(input.toDouble()).toInt()
  val dim = if (sqrt % 2 == 0) sqrt + 1 else sqrt + 2
  val coord = spiral(dim).get(input - 1)
  println(Math.abs(coord.first) + Math.abs(coord.second))
}
