count = 0
position = 0
with open('input.txt', 'r') as f:
    while True:
        c = f.read(1)
        position += 1
        if not c:
            print(count)
            break
        if c == "(":
            count += 1
        elif c == ")":
            count -= 1
        else:
            continue
