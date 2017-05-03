// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 1;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 257;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 65537;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 65793;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[9] = "id6_R_t3: 1;id7_R_t3: 1";
outputs[10] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[11] = "id6_R_t3: 257;id7_R_t3: 1";
outputs[12] = "id6_R_t3: 65536;id7_R_t3: 1";
outputs[13] = "id6_R_t3: 65537;id7_R_t3: 1";
outputs[14] = "id6_R_t3: 65792;id7_R_t3: 1";
outputs[15] = "id6_R_t3: 65793;id7_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2z9PwkAYx/HdV9FRE5LS3tFGjYPEEBc1wYGRmNShiYpDmYzvXaAFSrmWAndXit+NPPenlMInv+R4
//XHcyTb6nies6cRSMh+NE3Djd2zgKl69d93MSvX/MJjz2nTvn5zKO/PFonHid2QqxeHXVcTaqMlcVymp6
//pXk1vU5a9WYzPt/ir3ndz83O10VJXZbUe/O6v10PSq6bvZ9f5/75wXl6+T93XLij/C7raqCcm99BKHcQ
//yh2Ecgep3EEqd5DKHdJ1xbnr6sYzHvYHi4e88YyWn89sZXe+umzQqxr0qwZFNhhWrQzVK7M3Psi+nMr9
//1avTla+jbOU+P4gLV0WFBxVQARW6NFgPrh5x1zwUiqvuzUc1E34vAAqgAIoamWJPKFaP0rMJhTAGRQgU
//QAEUekJD00z4yi+hIGWAB3i0KWXIRviQpAygAIr2pAx5QinDFB5BryfIGfABH0efkGzbsroh3yYg+Y9R
//NxUkDaiAisM0qEgazUChThrm+AivffiAD/iokTRqHI00zYewzoeAD/iADx0HJqeZPQSJBFIgpSWJRJ4a
//KpJEAh/w0YpEItuRSOySku9V8eAETkgjdntVtgdzGB3eqVKoZ3vu7l+p0acCEzDBKYzVPhUdSNTuUtlN
//R63/j8IETJAmrHap6GVCGGMihAmYgIlmelTMZQkbdJAwoAM6GutQ0YuHJGHABEycW3+KjYRhio5idwp4
//gAcZw2p3il4+dhycHgUFKQMogKKh3hQbKcMcHpv/AwUP8CBlWOxMMXdSYgcPAR7gAR5N9KXYPj8hjQAK
//oJx1V4q5UxXSCHiAxxn3pNg+a9EJyh9WV6iI
