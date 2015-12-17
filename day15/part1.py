import numpy
import re
import itertools as it

def sumpos(list):
    return max(0, sum(list))

number_ingredients = 4
a = numpy.zeros(shape=(5, number_ingredients))
amts = numpy.zeros(shape=(1, number_ingredients))
ingredients = []

with open('input.txt', 'r') as f:
    col = 0
    for line in f.readlines():
        split = re.findall(r"[-\w']+", line)
        ingredients.append(split[0])
        for row in range(0, 5):
            a[row, col] = int(split[2+(2*row)])
        col += 1

prod = a * amts

max_total = 0
for prod in it.product(range(101), repeat=number_ingredients):
    if sum(prod) == 100:
        print(prod)
        amts[0,0] = prod[0]
        amts[0,1] = prod[1]
        amts[0,2] = prod[2]
        amts[0,3] = prod[3]
        matrix_prod = a * amts
        max_total = max(max_total, numpy.product(map(sumpos, matrix_prod)[:-1]))

print(str(max_total))
