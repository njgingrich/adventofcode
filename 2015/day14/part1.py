import re

def read_input(name):
    graph = {}
    with open(name, 'r') as f:
        for line in f.readlines():
            split = re.findall(r"[\w']+", line)
            graph[split[0]] = [int(split[3]), int(split[7]), int(split[14]), 0, 0]
    return graph

def advance(time):
    newtime = time + 1
    for r in reindeer:
        curtime = time
        total_time = reindeer[r][1] + reindeer[r][2]
        while curtime > total_time:
            curtime -= total_time
        if curtime <= reindeer[r][1]:
            reindeer[r][3] += reindeer[r][0]
    return newtime

reindeer = read_input('input.txt')

time = 1 
while time <= 2503:
    time = advance(time)

for r in reindeer:
    print(r + ": " + str(reindeer[r][3]))
