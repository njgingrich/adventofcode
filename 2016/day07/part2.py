import re

pattern = r"\[(\w+)\]"
lines = []

def has_abba(s):
    i = 0
    while (i+3) < len(s):
        #print("testing {} in {}".format(s[i:i+4], s))
        if s[i] == s[i+3] and s[i+1] == s[i+2] and s[i] != s[i+1]:
            #print("has abba {} in {}".format(s[i:i+4], s))
            return True
        i += 1

def has_aba(s):
    i = 0
    while (i+2) < len(s):
        if s[i] == s[i+2] and s[i+1] != s[i]:
            return True

def has_aba_bab(s):


def remove_hypernet(s):
    count = s.count('[')
    #print("count: {}".format(count))
    new_s = s
    while count > 0:
        open_ix = new_s.find('[')
        close_ix = new_s.find(']')
        new_s = new_s[:open_ix] + "?" + new_s[close_ix+1:] # add a extra char to avoid fake hits
        count -= 1

    return new_s

with open('input.txt', 'r') as f:
    for line in f:
        line = line.strip()
        m = re.findall(pattern, line)

        raw_line = remove_hypernet(line)
        group_str = ""
        for g in m:
            group_str = group_str + "?" + g

        if not has_abba(group_str) and has_abba(raw_line):
            lines.append(line)


print(len(lines))
