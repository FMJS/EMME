# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import struct
import zlib, base64
from ecmasab.exceptions import UnreachableCodeException

def values_from_int(int_value, begin, end):
    size = (end-begin)+1
    values = list(struct.pack(get_int_type(size), int(int_value)))
    values = ([None] * begin) + values
    return values

def values_from_float(float_value, begin, end):
    size = (end-begin)+1
    values = list(struct.pack(get_float_type(size), float(float_value)))
    values = ([None] * begin) + values
    return values

def int_from_values(values):
    ret = struct.unpack(get_int_type(len(values)), bytearray(values))
    return ret[0]

def float_from_values(values):
    ret = struct.unpack(get_float_type(len(values)), bytearray(values))
    return ret[0]

def get_int_type(size):
    if size <= 1:
        return '<b'
    elif size <= 2:
        return '<h'
    elif size <= 4:
        return '<i'
    elif size <= 8:
        return '<q'
    else:
        raise UnreachableCodeException("Type size \"%s\" not valid"%(size))

def get_float_type(size):
    if size <= 4:
        return '<f'
    elif size <= 8:
        return '<d'
    else:
        raise UnreachableCodeException("Type size \"%s\" not valid"%(size))
    
def compress_string(input_str):
    return str(base64.b64encode(zlib.compress(input_str,9)))

def uncompress_string(input_str):
    return str(zlib.decompress(base64.b64decode(input_str)))
