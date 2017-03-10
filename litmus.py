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

import commands
import argparse
import sys
import multiprocessing
import signal
import time
from six.moves import range

K = "k"
M = "M"

def run_command(command, number, silent):

    try:
        outputs_dic = {}

        for i in range(number):

            out = commands.getoutput(" ".join(command))
            # process = subprocess.Popen(command, stdout=subprocess.PIPE)
            # out, err = process.communicate()

            out = out.split("\n")
            out = [x for x in out if x != ""]
            out.sort()
            out = ";".join(out)

            if i > 0:
                if (i%1000) == 0:
                    if not silent: sys.stdout.write('k')
                    sys.stdout.flush()
                else:
                    if (i%100) == 0:
                        if not silent: sys.stdout.write('.')
                        sys.stdout.flush()


            if out not in outputs_dic:
                outputs_dic[out] = 1
            else:
                outputs_dic[out] += 1

        return outputs_dic

    except KeyboardInterrupt:
        raise KeyboardInterrupt()

def main(command, outputs, number, threads, percent, silent):

    command = command.split(" ")
    outputs_dic = {}

    factor = 1

    if K in number:
        number = number.replace(K,"")
        factor = factor * (10**3)

    if M in number:
        number = number.replace(M,"")
        factor = factor * (10**6)

    try:
        number = int(number)
    except Exception:
        number = 1
        
    number = int(number)*factor

    try:
        with open(outputs, "r") as f:
            for line in f.readlines():
                line = line.replace("\n","")
                line = line.split(";")
                line.sort()
                line = ";".join(line)
                outputs_dic[line] = 0
    except Exception:
        print("File not found \"%s\""%outputs)
        sys.exit(1)

    original_sigint_handler = signal.signal(signal.SIGINT, signal.SIG_IGN)
            
    num_t = threads
    pool = multiprocessing.Pool(num_t)
    async_results = []
    outputs_t = []
    
    signal.signal(signal.SIGINT, original_sigint_handler)
    
        
    for i in range(num_t):
        async_results.append(pool.apply_async(run_command, (command, number/num_t, silent)))

    if silent:
        sys.stdout.write("Running (x%s) \"%s\"..."%(number, " ".join(command)))
        sys.stdout.flush()
        
    try:
        if not silent: print("Running...")
        time.sleep(5)
        
    except KeyboardInterrupt:
        print("Caught KeyboardInterrupt, terminating workers")
        pool.terminate()
        sys.exit(1)


    for i in range(num_t):
        outputs_t.append(async_results[i].get())

        
    not_matched = []
    for outputs in outputs_t:
        for el in outputs:
            if el not in outputs_dic:
                not_matched.append(el)
            else:
                outputs_dic[el] += outputs[el]

    not_matched = list(set(not_matched))

    results = [(v, k) for k, v in outputs_dic.iteritems()]
    results.sort()
    results.reverse()

    if not silent: sys.stdout.write('\n=== Results ===\n')
    sys.stdout.flush()

    for el in not_matched:
        if not silent: print("NOT MATCHED OUTPUT ERROR: \"%s\""%el)
                
    matches = 0
    for result in results:
        if result[0] > 0:
            num = result[0] if not percent else float(float(result[0]*100)/float(number))
            if percent:
                if not silent: print("%.2f%%\t\"%s\""%(num, result[1]))
            else:
                if not silent: print("%s\t\"%s\""%(num, result[1]))
            matches += 1

    if percent:
        if not silent: print("Coverage: %.2f%%"%(float(float(matches*100)/float(len(results)))))
    else:
        if not silent: print("Coverage: %s/%s"%(matches, len(results)))


    if silent:
        if len(not_matched) > 0:
            print("FAIL")
        else:
            print("PASS")

            
if __name__ == "__main__":

    command = None
    outputs = None
    number = None
    threads = None
    percent = None
        
    parser = argparse.ArgumentParser(description='Litmus tests checking.')

    parser.set_defaults(command=None)
    parser.add_argument('-c', '--command', metavar='command', type=str, required=True,
                       help='the command to be executed')

    parser.set_defaults(outputs=None)
    parser.add_argument('-o', '--outputs', metavar='outputs', type=str, required=True,
                       help='possible outputs')

    parser.set_defaults(number="100")
    parser.add_argument('-n', '--number', metavar='number', type=str, 
                       help='total executions')

    parser.set_defaults(threads=1)
    parser.add_argument('-j', '--threads', metavar='number', type=int,
                       help='number of threads')

    parser.set_defaults(silent=False)
    parser.add_argument('-s', '--silent', dest='silent', action='store_true',
                       help='show only PASS/FAIL')
    
    parser.set_defaults(percent=True)
    parser.add_argument('-t', '--total', dest='percent', action='store_false',
                       help='show the total number of matches')

    

    args = parser.parse_args()

    command = args.command
    outputs = args.outputs
    number = args.number
    threads = args.threads
    percent = args.percent
    silent = args.silent
    
    main(command, outputs, number, threads, percent, silent)
