class Position:
    x = 0
    y = 0

max = Position()
directions = []

with open('input.txt', 'r') as f:
    while True:
        c = f.read(1)
        if not c:
            break
        directions.append(c)
        if c == '^':
            max.y += 1
        elif c == '>':
            max.x += 1

map = [[0 for x in range(max.x)] for x in range(max.y)]

santa = Position()
roboSanta = Position()

turn = 0
for d in directions:
    if turn % 2 == 0:
        if d == '^':
            santa.y += 1
        elif d == 'v':
            santa.y -= 1
        elif d == '>':
            santa.x += 1
        elif d == '<':
            santa.x -= 1
        map[santa.x][santa.y] += 1
    else: 
        if d == '^':
            roboSanta.y += 1
        elif d == 'v':
            roboSanta.y -= 1
        elif d == '>':
            roboSanta.x += 1
        elif d == '<':
            roboSanta.x -= 1
        map[roboSanta.x][roboSanta.y] += 1
    turn += 1

houses = 0
for y in range(max.y):
    for x in range(max.x):
        if map[y][x] > 0:
            houses += 1

print("houses visited: %d" % houses)















