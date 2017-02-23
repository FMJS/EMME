#!/usr/bin/env python

# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
import unittest
import shutil

from ecmasab.printers import JSV8Printer
from emme import Config, main

sv = "examples/single_var/sv_simple%s"
dv = "examples/double_vars/dv_simple%s"
tv = "examples/triple_vars/tv_simple%s"

examples = []
ex_sv_s = []
ex_sv_h = []
ex_dv = []
ex_tv = []

# Single variable examples
ex_sv_s.append(sv%"01")
ex_sv_s.append(sv%"02")
ex_sv_s.append(sv%"03")
ex_sv_s.append(sv%"04")
ex_sv_s.append(sv%"05")
ex_sv_h.append(sv%"06")
ex_sv_h.append(sv%"07")
ex_sv_h.append(sv%"08")
ex_sv_h.append(sv%"09")
ex_sv_h.append(sv%"10")
ex_sv_h.append(sv%"11")
ex_sv_h.append(sv%"12")
ex_sv_h.append(sv%"13")
ex_sv_h.append(sv%"14")
ex_sv_h.append(sv%"15")
ex_sv_h.append(sv%"16")
ex_sv_h.append(sv%"17")
ex_sv_h.append(sv%"18")
ex_sv_h.append(sv%"19")

ex_sv = ex_sv_s + ex_sv_h

# Double variables examples
ex_dv.append(dv%"01")

# Triple variables examples
ex_tv.append(tv%"01")

examples = ex_sv + ex_dv + ex_tv


def run_all(example, skip_solving, sat, expand):

    config = Config()
    config.inputfile = example+".txt"
    config.prefix = example+"/"
    if sat:
        config.prefix = "/tmp/"+example+"/"
        shutil.rmtree(config.prefix)
    config.sat = sat
    config.verbosity = 3
    config.jsprinter = JSV8Printer().NAME
    config.skip_solving = skip_solving
    expand_bounded_sets = expand

    try:
        main(config)
    except:
        assert False
        
    assert True

def test_generation():
    for example in examples:
        yield run_all, example, True, False, True
    
def test_all():
    for example in ex_sv_s:
        yield run_all, example, False, True, True

    for example in ex_sv_s:
        yield run_all, example, False, True, False
        
