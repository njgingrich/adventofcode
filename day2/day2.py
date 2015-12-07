def totalNeeded(l, w, h):
    return surfaceArea(l, w, h) + minArea(l, w, h)

def surfaceArea(l, w, h):
    return 2*(w*l + w*h + h*l)

def ribbonLength(l, w, h):
    numbers = [l, w, h]
    numbers.sort()
    return l*w*h + 2*(numbers[0] + numbers[1])

def minArea(l, w, h):
    numbers = [l, w, h]
    numbers.sort()
    return numbers[0] * numbers[1]

with open('input.txt', 'r') as f:
    totalFeet = 0
    totalLength = 0
    while True:
        line = f.readline().rstrip()
        if not line:
            print("total feet:\t %d" % totalFeet)
            print("ribbon length:\t %d" % totalLength)
            break
        dims = line.split('x')
        totalFeet += totalNeeded(int(dims[0]), int(dims[1]), int(dims[2]))
        totalLength += ribbonLength(int(dims[0]), int(dims[1]), int(dims[2]))
