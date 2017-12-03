fun main(args: Array<String>) {
  val list = File("input.txt").readLines()
    	.map{ it.split("\\s+".toRegex()) }
    	.map{ it.map{ it.toInt() } }
    
    val sum = list.map{ it.max()!! - it.min()!! }.sum()
    println(sum)
}
