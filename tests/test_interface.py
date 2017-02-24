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
from tests.input_tests import examples, ex_sv_s

tmp_dir = ".tmp_examples/"

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

    for example in ex_sv_s:
        yield run_existing, example, False
        
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
        
