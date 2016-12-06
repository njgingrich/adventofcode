import hashlib

code = 'ugkcyxxp'

ix = 0
hex_s = hashlib.md5((code+str(ix)).encode('utf-8')).hexdigest()

passwd = ""
i = 0

while i < 8:
    ix += 1
    hex_s = hashlib.md5((code+str(ix)).encode('utf-8')).hexdigest()
    if (hex_s[0:5] == '00000'):
        print("{}: {}".format(ix, hex_s))
        passwd += hex_s[5]
        i += 1

print("pass: " + passwd)
