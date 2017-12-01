import java.io.File

fun main(args: Array<String>) {
	val result = File("input.txt").readLines()
		.map{ it.trim() }
		.map{ it.split("\\s+".toRegex()) }
		.filter{ isValidTriangle(it[0].toInt(), it[1].toInt(), it[2].toInt()) }

	println(result.size)
}

fun isValidTriangle(side1: Int, side2: Int, side3: Int): Boolean {
  return side1 + side2 > side3 && side2 + side3 > side1 && side1 + side3 > side2
}