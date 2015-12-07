class Position:
    x = 0
    y = 0

max = Position()
directions = []
santa = Position()

with open('input.txt', 'r') as f:
    santa = Position()
    while True:
        c = f.read(1)
        if not c:
            break
        directions.append(c)
        if c == '^':
            max.y += 1
            santa.y += 1
        elif c == 'v':
            santa.y -= 1
        elif c == '>':
            max.x += 1
            santa.x += 1
        elif c == '<':
            santa.x -= 1
        else:
            print("max X: %d, max y: %d" % (max.x, max.y))
            print("santa is at (%d, %d)" % (santa.x, santa.y))
            break

map = [[0 for x in range(max.x)] for x in range(max.y)]
checker = Position()
for d in directions:
    if d == '^':
        checker.y += 1
    elif d == 'v':
        checker.y -= 1
    elif d == '>':
        checker.x += 1
    elif d == '<':
        checker.x -= 1
    map[checker.x][checker.y] += 1

houses = 0
for y in range(max.y):
    for x in range(max.x):
        if map[y][x] > 0:
            houses += 1

print("houses visited: %d" % houses)















