def compare(first, second, third):
    return (first + second) > third and (first + third) > second and (second + third) > first

valid = 0

with open('input.txt', 'r') as f:
    for line in f:
        split = line.strip().split()
        if (compare(int(split[0]), int(split[1]), int(split[2]))):
            valid += 1

print(str(valid))
