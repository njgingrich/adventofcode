// https://gist.github.com/geoand/d629f5d3911c11c695742ab61951e7f8
fun <T1, T2> Collection<T1>.combine(other: Iterable<T2>): List<Pair<T1, T2>> {
    return combine(other, {thisItem: T1, otherItem: T2 -> Pair(thisItem, otherItem) })
}

fun <T1, T2, R> Collection<T1>.combine(other: Iterable<T2>, transformer: (thisItem: T1, otherItem:T2) -> R): List<R> {
    return this.flatMap { thisItem -> other.map { otherItem -> transformer(thisItem, otherItem) }}
}

fun main(args: Array<String>) {
	val result = File("input.txt").readLines()
    	.map{ it.split("\\s+".toRegex()) }
    	.map{ it.map{ it.toInt() } }
    	.map{ it.combine(it) }
    	.map{ it.filter{ it.first != it.second } }
    	.map{ it.filter{ it.first % it.second == 0 } }
    	.map{ it.map { it.first / it.second } }
    	.map{ it[0] }
    	.sum()
    
    println(result)
}
