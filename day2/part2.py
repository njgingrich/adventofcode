def ribbonLength(l, w, h):
    numbers = [l, w, h]
    numbers.sort()
    return l*w*h + 2*(numbers[0] + numbers[1])

with open('input.txt', 'r') as f:
    totalLength = 0
    while True:
        line = f.readline().rstrip()
        if not line:
            print("ribbon length:\t %d" % totalLength)
            break
        dims = line.split('x')
        totalLength += ribbonLength(int(dims[0]), int(dims[1]), int(dims[2]))
