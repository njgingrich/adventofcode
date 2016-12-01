import re

def read_file(file):
    lines = []
    with open(file, 'r') as f:
        for line in f.readlines():
            lines.append(line)

    return lines

hex_regex     = re.compile("\\\\x(.){2}")
esc_backslash = lambda x : x.replace("\\\\", "")
esc_backquote = lambda x : x.replace('\\"', "")
esc_quotes    = lambda x : x.replace('\"', "")
def esc_hex(line):
    match = hex_regex.search(line)
    if match:
        print(str(match.start()) + " -- " + str(match.end()))
        new = line[:match.start()] + line[match.end():]
        print("removed: " + new)
        return new 
    return line

lines = read_file('input.txt')
shortened = map(esc_backslash, lines)
shortened = map(esc_backquote, shortened)
shortened = map(esc_quotes, shortened)

for line in shortened:
    line = esc_hex(line)
    print(line)


