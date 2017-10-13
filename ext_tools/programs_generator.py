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

import argparse
import itertools
import sys
import os
import random

from argparse import RawTextHelpFormatter

RIU = "RIU"
WIU = "WIU"
RIA = "RIA"
WIA = "WIA"
RF = "RF"
WF = "WF"

PC = "|"
SC = ";"

types = [RIU,WIU,RIA,WIA,RF,WF]
operators = [PC,SC]

def is_canonic(word):
    if len(word) == 1:
        return word

    rep = []
    thr = []
    for el in word:
        if el == PC:
            rep.append(thr)
            thr = []
            continue
        thr.append(el)
    rep.append(thr)
    return sorted(rep) == rep

def only_writes(word):
    for el in word:
        if el in [RIU,RIA,RF]:
            return False

    return True

def check_correctness(ev):
    ty, size = ev[:2]
    
    if (ty in [RIU, WIU, RIA, WIA]) and (size in [8,16,32]):
        return True
    
    if (ty in [RF, WF]) and (size in [16,32]):
        return True

    return False
    

def print_evt(ev, value):
    ty, size, index = ev

    wvalue = value
    
    if ty in [WIU,WIA,WF]:
        if size == 8:
            length = 2
        if size == 16:
            length = 4
        if size == 32:
            length = 9

        wvalue = int(str((value % 9) + 1)*length)
    
    if ty == RIU:
        return "print(x-I%d[%d]);\n"%(size, index)
    elif ty == WIU:
        return "x-I%d[%d] = %d;\n"%(size, index, wvalue)
    elif ty == RIA:
        return "print(Atomics.load(x-I%d, %d));\n"%(size, index)
    elif ty == WIA:
        return "Atomics.store(x-I%d, %d, %d);\n"%(size, index, wvalue)
    else:
        pass
    
    if ty == RF:
        return "print(x-F%d[%d]);\n"%(size*2, index)
    elif ty == WF:
        return "x-F%d[%d] = %d.%d;\n"%(size*2, index, wvalue, int(str(value)*4))
    else:
        pass

    return None


def write_program(conf, filename):
    ret = ""
    ret += "var x = new SharedArrayBuffer();\n"
    thread_num = 1
    value = 1
    ret += "Thread t%d {\n"%(thread_num)
    valid = True
    for el in conf:
        if el == PC:
            ret += "}\n"
            thread_num += 1
            ret += "Thread t%d {\n"%(thread_num)
            continue
        if el == SC:
            continue
        ret += print_evt(el, value)
        if not check_correctness(el):
            valid = False
            break
        value += 1
    ret += "}\n"

    if not valid:
        return 1

    with open(filename, "w") as f:
        f.write(ret)

    return 0

def generate_programs(num_events, num_programs, sizes, indexes, path, en_random):
    possible_events = []
    basic_name = "sv_%dev-%0"

    for ty in types:
        for size in sizes:
            for index in indexes:
                if size == sizes[-1] and index == indexes[-1]:
                    continue
                possible_events.append((ty,size,index))

    print("Starting computation ...")
                
    count = 0
#    name_length = int(math.log(len(confs), 10))+1
    name_length = 1

    if en_random:
        picked = set([])
    
    for word in itertools.product(possible_events, repeat=num_events):
        if (num_programs != -1) and (count >= num_programs):
            break
        
        if en_random:
            word = None
            while (word is None) or (str(word) in picked):
                word = random.sample(possible_events, num_events)
            picked.add(str(word))

        if only_writes(word[0]):
            continue

        iterops = itertools.product(operators, repeat=(num_events-1))
        if en_random:
            iterops = list(iterops)
            random.shuffle(iterops)
        
        for ops in iterops:
            conf = list(word)
            for i,v in enumerate(ops):
                conf.insert(2*i+1,v)
            if is_canonic(conf):
                filename = (path+(basic_name+str(name_length)+"d.bex"))%(num_events, count)
                write_program(conf, filename)

                if ((count % 100) == 0) and (count > 0):
                    sys.stdout.write(".")
                    sys.stdout.flush()
                if ((count % 10000) == 0) and (count > 0):
                    sys.stdout.write(" 10k\n")
                    sys.stdout.flush()            

                count += 1
                if (num_programs != -1) and (count >= num_programs):
                    break

    print("\nGenerated %s programs"%(count))
    

def main(args):
    parser = argparse.ArgumentParser(description='Programs generator', formatter_class=RawTextHelpFormatter)
    
    parser.add_argument('directory', metavar='directory', type=str, 
                       help='the directory where to store the programs')

    parser.set_defaults(num_events=1)
    parser.add_argument('-n', '--num-events', metavar='num_events', type=int,
                       help='number of possible events. (Default is \"1\")')

    parser.set_defaults(num_programs=-1)
    parser.add_argument('-p', '--num-programs', metavar='num_programs', type=int,
                        help='number of generated programs. (Default is all)')
    
    parser.set_defaults(random=False)
    parser.add_argument('-r', '--enable-random', dest='en_random', action='store_true',
                        help="generate random programs instead of ordered. (Default is \"%s\")"%False)
    
    parser.set_defaults(sizes="16,32")
    parser.add_argument('-s', '--sizes', metavar='sizes', type=str, nargs='?',
                        help='comma separated list of possible sizes. (Default is \"16,32\")')

    parser.set_defaults(indexes="0,1")
    parser.add_argument('-i', '--indexes', metavar='indexes', type=str,
                        help='comma separated list of possible indexes. (Default is \"0,1\")')

    if len(sys.argv)==1:
        parser.print_help()
        sys.exit(1)
    
    args = parser.parse_args(args)
        
    num_events = args.num_events
    num_programs = args.num_programs
    sizes = [int(x) for x in args.sizes.split(",")]
    indexes = [int(x) for x in args.indexes.split(",")]
    en_random = args.en_random

    path = "%s/"%(args.directory)

    if not os.path.exists(path):
        os.makedirs(path)

    generate_programs(num_events, num_programs, sizes, indexes, path, en_random)

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
    
