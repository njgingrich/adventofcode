grid = [[0 for x in range(1000)] for x in range(1000)]

def getCoords(string):
    pairs = line.split(' ')
    coords = []
    for pair in pairs:
        for s in pair.split(','):
            coords.append(int(s))
    return coords

def countLights(grid):
    brightness = 0
    for row in range(0, 1000):
        for col in range(0, 1000):
            brightness += grid[row][col]
    return brightness

with open('input.txt', 'r') as f:
    for line in f:
        line = line.strip().replace("through ", "")
        if line.find("turn on ") != -1:
            line = line[8:]
            coords = getCoords(line)
            for row in range(coords[0], coords[2]+1):
                for col in range(coords[1], coords[3]+1):
                    grid[row][col] += 1

        elif line.find("toggle ") != -1:
            line = line[7:]
            coords = getCoords(line)
            for row in range(coords[0], coords[2]+1):
                for col in range(coords[1], coords[3]+1):
                    grid[row][col] += 2

        elif line.find("turn off ") != -1:
            line = line[9:]
            coords = getCoords(line)
            for row in range(coords[0], coords[2]+1):
                for col in range(coords[1], coords[3]+1):
					if grid[row][col] != 0:
						grid[row][col] -= 1
    
	
print countLights(grid)



