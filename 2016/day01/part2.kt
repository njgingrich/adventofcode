enum class DIR {
    NORTH, SOUTH, EAST, WEST
}

data class Position(var x: Int, var y: Int)

fun main(args: Array<String>) {
    val input = """L5, R1, L5, L1, R5, R1, R1, L4, L1, L3, R2, R4, L4, L1, L1, R2, R4, R3, L1, R4, L4, L5, L4, R4, L5, R1, R5, L2, R1, R3, L2, L4, L4, R1, L192, R5, R1, R4, L5, L4, R5, L1, L1, R48, R5, R5, L2, R4, R4, R1, R3, L1, L4, L5, R1, L4, L2, L5, R5, L2, R74, R4, L1, R188, R5, L4, L2, R5, R2, L4, R4, R3, R3, R2, R1, L3, L2, L5, L5, L2, L1, R1, R5, R4, L3, R5, L1, L3, R4, L1, L3, L2, R1, R3, R2, R5, L3, L1, L1, R5, L4, L5, R5, R2, L5, R2, L1, L5, L3, L5, L5, L1, R1, L4, L3, L1, R2, R5, L1, L3, R4, R5, L4, L1, R5, L1, R5, R5, R5, R2, R1, R2, L5, L5, L5, R4, L5, L4, L4, R5, L2, R1, R5, L1, L5, R4, L3, R4, L2, R3, R3, R3, L2, L2, L2, L1, L4, R3, L4, L2, R2, R5, L1, R2"""
    val inputs = input.split(", ")
    var pos = Position(0, 0)
    var visited = mutableSetOf<String>()
    var facing = DIR.NORTH
    var step: Int = 0
    var quit = false

    for (cmd in inputs) {
        step++
        facing = turn(facing, cmd[0])
        val stepCount = cmd.slice(1..cmd.length-1).toInt()
        for (i in 1..stepCount) {
            when (facing) {
                DIR.NORTH -> pos.y++
                DIR.SOUTH -> pos.y--
                DIR.EAST -> pos.x++
                DIR.WEST -> pos.x--
            }
            if (!visited.add("${pos.x} ${pos.y}")) {
                quit = true
                break
            }
        }
        if (quit) break
    }
    println(Math.abs(pos.x) + Math.abs(pos.y))
}

fun turn(facing: DIR, dir: Char): DIR {
    return when (facing) {
        DIR.NORTH -> if (dir == 'L') DIR.WEST else DIR.EAST
        DIR.SOUTH -> if (dir == 'L') DIR.EAST else DIR.WEST
        DIR.EAST -> if (dir == 'L') DIR.NORTH else DIR.SOUTH
        DIR.WEST -> if (dir == 'L') DIR.SOUTH else DIR.NORTH
    }
}