keypad = [[1,2,3],
          [4,5,6],
          [7,8,9]]

cur = (1, 1)
ops = {
    "U": (0, -1),
    "D": (0, 1),
    "L": (-1, 0),
    "R": (1, 0)
}

with open('input.txt', 'r') as f:
    for line in f:
        for c in line.strip():
            cur = (max(0, min(cur[0]+ops[c][0], 2)), # min of potential and farthest right (2)
                   max(0, min(cur[1]+ops[c][1], 2))) # then max of that and farthest left (0)

        print(keypad[cur[1]][cur[0]])
