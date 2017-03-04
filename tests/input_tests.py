from six.moves import range

sv = "examples/single_var/sv_simple%s"
it = "examples/single_var/ite/sv_i_simple%s"
dv = "examples/double_vars/dv_simple%s"
tv = "examples/triple_vars/tv_simple%s"

examples = []
ex_fast = []
ex_slow = []
ex_it = []
ex_dv = []
ex_tv = []

# Single variable examples
for f in ["%02d"%x for x in range(1, 11)]:
    ex_fast.append(sv%f)

for f in ["%02d"%x for x in range(11, 21)]:
    ex_slow.append(sv%f)

ex_sv = ex_fast + ex_slow

# ITE examples
ex_it.append(it%"01")

# Double variables examples
ex_dv.append(dv%"01")

# Triple variables examples
ex_tv.append(tv%"01")

examples = ex_sv + ex_dv + ex_tv + ex_it

invalids = []

ii = "tests/invalid_inputs/test%s"

for f in ["%02d"%x for x in range(1, 11)]:
    invalids.append(ii%f)
