def up(num):
    if num in set([1,2,3]):
        return num
    else:
        return num-3

def down(num):
    if num in set([7,8,9]):
        return num
    else:
        return num+3

def left(num):
    if num in set([1,4,7]):
        return num
    else:
        return num-1

def right(num):
    if num in set([3,6,9]):
        return num
    else:
        return num+1

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
            # print("cur: {} (after {}".format(cur, c))
        numbers.append(cur)
        # print("added #{}".format(cur))

print("pass: {}".format(numbers))
