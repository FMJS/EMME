sv = "examples/single_var/sv_simple%s"
dv = "examples/double_vars/dv_simple%s"
tv = "examples/triple_vars/tv_simple%s"

examples = []
ex_sv_s = []
ex_sv_h = []
ex_dv = []
ex_tv = []

# Single variable examples
for f in ["%02d"%x for x in range(1, 6)]:
    ex_sv_s.append(sv%f)

for f in ["%02d"%x for x in range(6, 21)]:
    ex_sv_h.append(sv%f)

ex_sv = ex_sv_s + ex_sv_h

# Double variables examples
ex_dv.append(dv%"01")

# Triple variables examples
ex_tv.append(tv%"01")

examples = ex_sv + ex_dv + ex_tv

invalids = []

ii = "tests/invalid_inputs/test%s"

for f in ["%02d"%x for x in range(1, 11)]:
    invalids.append(ii%f)
