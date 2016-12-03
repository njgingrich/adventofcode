grid = [[0 for x in range(7)] for y in range(7)]
# adding a padding border of 0 lets us avoid boundary checks
grid[1][3] = 1
grid[2][2] = 2
grid[2][3] = 3
grid[2][4] = 4
grid[3][1] = 5
grid[3][2] = 6
grid[3][3] = 7
grid[3][4] = 8
grid[3][5] = 9
grid[4][2] = 'A'
grid[4][3] = 'B'
grid[4][4] = 'C'
grid[5][3] = 'D'

row = 3
col = 1

def up(num):
    global row, col
    p = grid[row-1][col]
    if (p != 0):
        row = row - 1
        return p
    else:
        return num

def down(num):
    global row, col
    p = grid[row+1][col]
    if (p != 0):
        row = row + 1
        return p
    else:
        return num

def left(num):
    global row, col
    p = grid[row][col-1]
    if (p != 0):
        col = col - 1
        return p
    else:
        return num

def right(num):
    global row, col
    p = grid[row][col+1]
    if (p != 0):
        col = col + 1
        return p
    else:
        return num

numbers = []
cur = 5
fnDict = {
    "U": up,
    "D": down,
    "L": left,
    "R": right
}

with open('input.txt', 'r') as f:
    for line in f:
        for c in line.strip():
            cur = fnDict[c](cur)

        numbers.append(cur)

print("pass: {}".format(numbers))
