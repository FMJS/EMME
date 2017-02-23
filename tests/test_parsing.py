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

from ecmasab.beparsing import BeParser
from ecmasab.printers import CVC4Printer, JSV8Printer

def parse_and_generate(example):

    strp = open("%s.txt"%example,"r").read()

    parser = BeParser()
    program = parser.program_from_string(strp)

    c4printer = CVC4Printer()

    c4printer.print_program(program)
    c4printer.print_data_type(program)
    c4printer.print_block_type(program)

    jprinter = JSV8Printer()

    jprinter.print_program(program)

    executionstr = open("%s/models.txt"%example,"r").read()

    executions = parser.executions_from_string(executionstr)
    c4printer.print_executions(executions)
    jprinter.print_executions(program, executions)

    assert True

def test_sv_parsing():
    sv = "examples/single_var/sv_simple%s"
    dv = "examples/double_vars/dv_simple%s"
    tv = "examples/triple_vars/tv_simple%s"
    
    examples = []

    # Single variable examples
    examples.append(sv%"01")
    examples.append(sv%"02")
    examples.append(sv%"03")
    examples.append(sv%"04")
    examples.append(sv%"05")
    examples.append(sv%"06")
    examples.append(sv%"07")
    examples.append(sv%"08")
    examples.append(sv%"09")
    examples.append(sv%"10")
    examples.append(sv%"11")
    examples.append(sv%"12")
    examples.append(sv%"13")
    examples.append(sv%"14")
    examples.append(sv%"15")
    examples.append(sv%"16")
    examples.append(sv%"17")
    examples.append(sv%"18")
    examples.append(sv%"19")

    # Double variables examples
    examples.append(dv%"01")
    
    # Triple variables examples
    examples.append(tv%"01")
    
    for example in examples:
        yield parse_and_generate, example
