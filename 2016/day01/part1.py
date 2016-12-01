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

directions = []
direction = Direction.north
dx = 0
dy = 0

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

    if (direction is Direction.north):
        dy = dy + int(d[1:])
    elif (direction is Direction.east):
        dx = dx + int(d[1:])
    elif (direction is Direction.south):
        dy = dy - int(d[1:])
    elif (direction is Direction.west):
        dx = dx - int(d[1:])

print(directions)

print("x: " + str(dx))
print("y: " + str(dy))
print("sum: " + str(dx+dy))
