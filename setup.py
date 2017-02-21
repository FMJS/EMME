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

from setuptools import setup, find_packages

with open('README.rst') as f:
    readme = f.read()

with open('LICENSE') as f:
    license = f.read()

setup(
    name='ECMAScript Memory Model Evaluator',
    version='0.1.0',
    description='Formal Verification suite for the analysis of JavaScript SharedArrayBuffer programs',
    long_description=readme,
    author='Cristian Mattarei',
    author_email='cristian.mattarei@gmail.com',
    url='https://github.com/FMJS/emme',
    install_requires=["six","pyparsing","nose"],
    license=license,
    packages=find_packages(exclude=('ecmasab', 'tests'))
)
