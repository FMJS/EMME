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

from litmus import Config, litmus
from tests.input_tests import jstests, jstests_fast

def run(example):
    config = Config()
    abspath = os.path.abspath(__file__)
    path = ("/".join(abspath.split("/")[:-2]))
    config.command = "bash %s/ext_tools/run_v8.sh"%path
    config.input_file = "%s/tests/%s"%(path, example)
    config.threads = 1
    config.number = "10"
    config.silent = True

    assert litmus(config) == 0
    
def test_correctness():
    for example in jstests_fast:
        yield run, example

if __name__ == "__main__":
    for example in jstests:
        run(example)
        
