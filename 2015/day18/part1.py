import numpy as np
import copy

num_rows = 100
num_cols = 100

def make_grid():
    grid = np.zeros(shape=(num_rows, num_cols))
    with open('input.txt', 'r') as f:
        row = 0
        for line in f.readlines():
            for i,c in enumerate(line.strip()):
                if c == '#':
                    grid[row, i] = 1
                else:
                    grid[row, i] = 0
            row += 1
    return grid

def neighbors_on(grid, index):
    sum = 0
    for row in xrange(max(0, index[0]-1), min(index[0]+2, num_rows)):
        for col in xrange(max(0, index[1]-1), min(index[1]+2, num_cols)):
            if row == index[0] and col == index[1]:
                pass
            else:
                try:
                    sum += grid[row, col]
                except:
                    pass
    return sum

def step(grid):
    newgrid = copy.deepcopy(grid)
    it = np.nditer(newgrid, flags=['multi_index'])
    while not it.finished:
        if it[0] == 1 and neighbors_on(grid, it.multi_index) not in (2,3):
                newgrid[it.multi_index[0], it.multi_index[1]] = 0
        elif it[0] == 0 and neighbors_on(grid, it.multi_index) == 3:
            newgrid[it.multi_index[0], it.multi_index[1]] = 1
        it.iternext()

    return newgrid
                    
grid = make_grid()
for x in range(0, 100):
    grid = step(grid)

print(sum(sum(grid)))
