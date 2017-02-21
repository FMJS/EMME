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

class ParserTestSuite(unittest.TestCase):
    """Basic test cases."""

    def __parsing(self, example):

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

    def test_parsing01(self):
        self.__parsing("examples/single_var/sv_simple01")
        
    def test_parsing02(self):
        self.__parsing("examples/single_var/sv_simple02")

    def test_parsing03(self):
        self.__parsing("examples/single_var/sv_simple03")
        
    def test_parsing04(self):
        self.__parsing("examples/single_var/sv_simple04")
        
    def test_parsing09(self):
        self.__parsing("examples/single_var/sv_simple09")
        
    def test_parsing05(self):
        self.__parsing("examples/single_var/sv_simple05")

    def test_parsing08(self):
        self.__parsing("examples/single_var/sv_simple08")
        
    def test_parsing13(self):
        self.__parsing("examples/single_var/sv_simple13")
        
    def test_parsing14(self):
        self.__parsing("examples/single_var/sv_simple14")
        
    def test_parsing10(self):
        self.__parsing("examples/single_var/sv_simple10")
        
    def test_parsing11(self):
        self.__parsing("examples/single_var/sv_simple11")

if __name__ == "__main__":
    unittest.main()
