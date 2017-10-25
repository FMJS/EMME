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
import zlib
import base64
import sys
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
    endian = '<'
    
    if size <= 1:
        return endian+'b'
    elif size <= 2:
        return endian+'h'
    elif size <= 4:
        return endian+'i'
    elif size <= 8:
        return endian+'q'
    else:
        raise UnreachableCodeException("Type size \"%s\" not valid"%(size))

def get_float_type(size):
    endian = '<'
    
    if size <= 4:
        return endian+'f'
    elif size <= 8:
        return endian+'d'
    else:
        raise UnreachableCodeException("Type size \"%s\" not valid"%(size))

def compress_string(input_str):
    if sys.version_info.major <= 2:
        return str(base64.b64encode(zlib.compress(input_str.encode('utf-8'))))
    else:
        return str(base64.b64encode(zlib.compress(input_str.encode('utf-8'))), 'utf-8')

def decompress_string(input_str):
    if sys.version_info.major <= 2:
        return zlib.decompress(base64.b64decode(bytes(input_str.decode('utf-8')))).decode('utf-8')
    else:
        return zlib.decompress(base64.b64decode(bytes(input_str, "utf-8"))).decode('utf-8')

def auto_convert(strval):
    if (strval.upper() == "TRUE") or (strval.upper() == "YES"):
        return True
    if (strval.upper() == "FALSE") or (strval.upper() == "NO"):
        return False
    try:
        return int(strval)
    except Exception:
        try:
            return float(strval)
        except Exception:
            return strval
