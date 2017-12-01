import java.io.File

fun main(args: Array<String>) {
  val result = File("input.txt").readLines()
    .map{ it.trim() }
    .map{ it.split("\\s+".toRegex()) }
    .chunked(3) { it ->
      arrayOf(0, 1, 2)
        .map{ i -> isValidTriangle(it[0][i].toInt(), it[1][i].toInt(), it[2][i].toInt()) }
        .map{ if (it) 1 else 0 }
        .sum()
    }.sum()

  println(result)
}

fun isValidTriangle(side1: Int, side2: Int, side3: Int): Boolean {
  return side1 + side2 > side3 && side2 + side3 > side1 && side1 + side3 > side2
}