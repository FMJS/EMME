from six.moves import range


FAST="fast"
INVALID="invalid"
PARAM = "param"

tests = []
attr = {}

with open("tests/tests.lst", "r") as f:
    for line in f.readlines():
        line = line.replace("\n","")
        if (line == "") or (line[0] == "#"): continue
        test = line.split(";")
        tests.append(test[0])
        attr[test[0]] = test[1:]

        
ex_fast = [x for x in tests if FAST in attr[x]]
examples = [x for x in tests if INVALID not in attr[x]]
invalids = [x for x in tests if INVALID in attr[x]]
