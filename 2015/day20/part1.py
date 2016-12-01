def factor(n):
    result = set()
    for i in range(1, int(n ** 0.5) + 1):
        div, mod = divmod(n, i)
        if mod == 0:
            result |= {i, div}
    return result

elf = 0
input = 36000000
presents = 0
while presents < input:
    factors = factor(elf)
    presents = sum(map(lambda x: 10*x, factors))
    elf += 1

print elf-1
