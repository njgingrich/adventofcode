from enum import Enum

class Direction(Enum):
    north = 0
    east = 1
    south = 2
    west = 3

    def left(self):
        if self.value is 0:
            return Direction.west
        else:
            return Direction(self.value-1)

    def right(self):
        if self.value is 3:
            return Direction.north
        else:
            return Direction(self.value+1)

grid = [[False for x in range(1000)] for x in range(1000)]
directions = []

direction = Direction.north
r = 500
c = 500

with open('input.txt', 'r') as f:
    for line in f:
        lines = line.strip().split(', ')
        for item in lines:
            directions.append(item)

for d in directions:
    if (d[0] == 'L'):
        direction = Direction.left(direction)
    elif (d[0] == 'R'):
        direction = Direction.right(direction)

    toMove = int(d[1:])
    print("moving {} in {}".format(toMove, direction))

    if (direction is Direction.north):
        for row in range(r - toMove, r):
            print("looking at [{}, {}]".format(row, c))
            if (grid[row][c] == 1):
                print("second visit at [{}, {}]".format(row, c))
                print("sum: {}".format(row+c-1000))
                exit()

            else:
                grid[row][c] = 1
        r = r - toMove
    elif (direction is Direction.east):
        for col in range(c+1, c + toMove+1):
            print("looking at [{}, {}]".format(r, col))
            if (grid[r][col] == 1):
                print("second visit at [{}, {}]".format(r, col))
                print("sum: {}".format(r+col-1000))
                exit()
            else:
                grid[r][col] = 1
        c = c + toMove
    elif (direction is Direction.south):
        for row in range(r+1, r + toMove + 1):
            print("looking at [{}, {}]".format(row, c))
            if (grid[row][c] == 1):
                print("second visit at [{}, {}]".format(row, c))
                print("sum: {}".format(row+c-1000))
                exit()
            else    :
                grid[row][c] = 1
        r = r + toMove
    elif (direction is Direction.west):
        for col in range(c - toMove, c):
            print("looking at [{}, {}]".format(r, col))
            if (grid[r][col] == 1):
                print("second visit at [{}, {}]".format(r, col))
                print("sum: {}".format(r+col-1000))
                exit()
            else:
                grid[r][col] = 1
        c = c - toMove
    print("ending row/col: [{}, {}]".format(r, c))

print(directions)

