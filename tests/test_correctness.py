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
import litmus

from tests.input_tests import jsprogs

def run(example):
    config = litmus.Config()
    abspath = os.path.abspath(__file__)
    path = ("/".join(abspath.split("/")[:-2]))
    config.command = "bash %s/ext_tools/run_v8.sh"%path
    js_program = "%s/tests/%s"%(path, example)
    config.input_file = js_program
    config.threads = 1
    config.number = "1"
    config.silent = True
    
    assert litmus.run_litmus(config) == 0
    
def test_correctness():
    for example in jsprogs:
        yield run, example

if __name__ == "__main__":
    for example in jsprogs:
        run(example)
        
