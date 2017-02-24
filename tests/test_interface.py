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
import os

from ecmasab.printers import JSV8Printer
from emme import Config, main

tmp_dir = ".tmp_examples/"

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

def run(config):
    config.verbosity = 3
    config.jsprinter = JSV8Printer().NAME
    config.defines = "enc_RF=0,enc_RBF1=0,enc_RBF2=0"
    
    main(config)

def run_fresh(example, skip_solving, expand):
    config = Config()
    config.inputfile = example+".txt"
    
    config.prefix = tmp_dir+example+"/"
    config.sat = True
    if os.path.exists(config.prefix):
        shutil.rmtree(config.prefix)
            
    config.skip_solving = skip_solving
    config.expand_bounded_sets = expand

    run(config)

    shutil.rmtree(tmp_dir)    

def run_existing(example, skip_solving):
    config = Config()
    config.inputfile = example+".txt"
    
    config.prefix = example+"/"
    config.sat = False
    config.skip_solving = skip_solving
    config.expand_bounded_sets = True

    run(config)

    
def test_generation():
    for example in examples:
        yield run_existing, example, True
    
def test_verification():
    for example in ex_sv_s:
        yield run_fresh, example, False, True

    for example in ex_sv_s:
        yield run_fresh, example, False, False
        

if __name__ == "__main__":
    for example in ex_sv_s:
        run_existing(example, True)
    for example in ex_sv_s:
        run_fresh(example, False, True)
        
