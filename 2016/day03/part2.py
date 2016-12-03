def compare(first, second, third):
    if ((first + second) > third and (first + third) > second and (second + third) > first):
        print("valid")
    else:
        print("invalid")

    return (first + second) > third and (first + third) > second and (second + third) > first

valid = 0
col1 = []
col2 = []
col3 = []

with open('input.txt', 'r') as f:
    for line in f:
        split = line.strip().split()
        col1.append(split[0])
        col2.append(split[1])
        col3.append(split[2])

for i in range(0, len(col1), 3):
    print("i's: {}, {}, {}".format(i, i+1, i+2))
    print("vals: {}, {}, {}".format(col1[i], col1[i+1], col1[i+2]))
    if (compare(int(col1[i]), int(col1[i+1]), int(col1[i+2]))):
        valid += 1
for i in range(0, len(col2), 3):
    print("i's: {}, {}, {}".format(i, i+1, i+2))
    print("vals: {}, {}, {}".format(col2[i], col2[i+1], col2[i+2]))
    if (compare(int(col2[i]), int(col2[i+1]), int(col2[i+2]))):
        valid += 1
for i in range(0, len(col3), 3):
    print("i's: {}, {}, {}".format(i, i+1, i+2))
    print("vals: {}, {}, {}".format(col3[i], col3[i+1], col3[i+2]))
    if (compare(int(col3[i]), int(col3[i+1]), int(col3[i+2]))):
        valid += 1

print(str(valid))
