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
import re

from ecmasab.parsing import BeParser, ParsingErrorException
from ecmasab.exceptions import UnreachableCodeException
from ecmasab.printers import PrintersFactory, PrinterType, BePrinter
from ecmasab.encoders import CVC4Encoder
from tests.input_tests import examples, invalids
from emme import Config

def parse(example, valid):
    try:
        with open("%s.bex"%example,"r") as f:
            strp = f.read()

        printers = PrintersFactory.get_printers()

        parser = BeParser()
        program = parser.program_from_string(strp)

        if program.params:
            program.apply_param(dict(program.get_params()[0]))
        
    except Exception as e:
        if not valid:
            print(e)
            return
        else:
            raise

    if not valid:
        assert(False)

    return program
        

def parse_and_generate(example):
    with open("%s.bex"%example,"r") as f:
        strp = f.read()

    printers = PrintersFactory.get_printers()

    parser = BeParser()
    program = parser.program_from_string(strp)

    if program.params:
        program.apply_param(dict(program.get_params()[0]))

    c4printer = CVC4Encoder()
    c4printer.print_program(program)
    c4printer.print_data_type(program)
    c4printer.print_block_type(program)

    config = Config()
    
    jprinters = PrintersFactory.get_printers_by_type(PrinterType.JS)
    jprinter = PrintersFactory.printer_by_name(config.jsprinter)

    assert(jprinter in jprinters)

    if not program.params:
        with open("%s/models.txt"%example,"r") as f:
            execsstr = f.read()
            
        execs = parser.executions_from_string(execsstr, program)
        eprint = c4printer.print_executions(execs)
        
        jprog = jprinter.print_program(program, execs)
        
        with open("%s/program.js"%example,"r") as f:
            a = f.read()
            b = jprog
            a = re.sub("//.*(\n|\Z)","",a)
            b = re.sub("//.*(\n|\Z)","",b)

            a = re.sub(re.compile("(\n)+", re.MULTILINE|re.DOTALL), '\n', a)
            b = re.sub(re.compile("(\n)+", re.MULTILINE|re.DOTALL), '\n', b)
            
            if a != b:
                print(example)
                print(a)
                print(b)
            assert a == b

        with open("%s/outputs.txt"%example,"r") as f:
            a = f.read().split("\n")
            b = jprinter.print_executions(program, execs).split("\n")
            a.sort()
            b.sort()
            assert a == b
        
    assert True

def printers_coherence(example):
    with open("%s.bex"%example,"r") as f:
        strp = f.read()

    parser = BeParser()
    program = parser.program_from_string(strp)

    if program.params:
        program.apply_param(dict(program.get_params()[0]))

    jprinters = PrintersFactory.get_printers_by_type(PrinterType.JS)
        
    if not program.params:
        with open("%s/models.txt"%example,"r") as f:
            execsstr = f.read()
        execs = parser.executions_from_string(execsstr, program)

        config = Config()
        
        jprinter = PrintersFactory.printer_by_name(config.jsprinter)
        jprog = jprinter.compute_possible_executions(program, execs)
        
        for jprinter in jprinters:
            assert jprinter.compute_possible_executions(program, execs) == jprog

        for jprinter in jprinters:
            assert jprinter.print_program(program, execs)
        
    assert True
    
def be_parsing(example):
    with open("%s.bex"%example,"r") as f:
        strp = f.read()

    parser = BeParser()
    program = parser.program_from_string(strp)

    beprinter = PrintersFactory.printer_by_name(BePrinter().NAME)
    beprogram = beprinter.print_program(program)
    strp = re.sub("\n+","\n",strp)
    strp = re.sub("//.*\n","",strp)
    beprogram = re.sub("//.*\n","",beprogram)

    strp = strp.replace(" ","")
    beprogram = beprogram.replace(" ", "")
    
    strp = re.sub(re.compile("Params\{.*\}", re.MULTILINE|re.DOTALL), '', strp)
    beprogram = re.sub(re.compile("Params\{.*\}", re.MULTILINE|re.DOTALL), '', beprogram)
    
    if not(strp == beprogram):
        print(example)
        print(strp)
        print(beprogram)
    
    assert(strp == beprogram)
    
def test_parse_valid():
    for example in examples:
        yield parse, example, True

def test_parse_and_generate():
    for example in examples:
        yield parse_and_generate, example

def test_parsing():
    for example in examples:
        yield be_parsing, example

def test_printers_coherence():
    for example in examples:
        yield printers_coherence, example

def test_parse_invalid():
    for invalid in invalids:
        yield parse, invalid, False
        
if __name__ == "__main__":
    for example in examples:
        parse(example, True)

    for example in examples:
        parse_and_generate(example)

    for example in examples:
        be_parsing(example)

    for example in examples:
        printers_coherence(example)

    for invalid in invalids:
        parse(invalid, False)
