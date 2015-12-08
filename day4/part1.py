import hashlib 

secretKey = "ckczppom"
integer = 0

while True:
    m = hashlib.md5()
    m.update(secretKey)
    m.update(str(integer))
    hash = m.hexdigest() 

    if hash[:5] == "00000":
        print("hash at %d: %s" % (integer, hash))
        break

    integer += 1

