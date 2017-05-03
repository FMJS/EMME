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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
outputs[0] = "id6_R_t3: 0";
outputs[1] = "id6_R_t3: 1";
outputs[2] = "id6_R_t3: 256";
outputs[3] = "id6_R_t3: 257";
outputs[4] = "id6_R_t3: 512";
outputs[5] = "id6_R_t3: 513";
outputs[6] = "id6_R_t3: 131072";
outputs[7] = "id6_R_t3: 131073";
outputs[8] = "id6_R_t3: 131328";
outputs[9] = "id6_R_t3: 131329";
outputs[10] = "id6_R_t3: 131584";
outputs[11] = "id6_R_t3: 131585";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmMFrwjAUxu/7K3JUENLkNeoGHiZDdtkG7uCxDLpDYU4P9TT839e02gZNS9Omk8F3C19enq/J73vB
//cL47pPtDyjlL4mm0jlJ6YAHn2138+ZWJz0u2YD+jJJbRJkrFJIuifDSesEwN9VhqVeWjQhXZePuRfGtd
//GtGmTjV6WJOnLn9R8/jIHl+f2Mvb/6g216sazSyVqqyqmYGsGciagawZqh0xVXWpFru7Xq7y7R2ddR1x
///rpsZaBX102KpknZNFn+/Op0uJaoIuJ9oyOOd9wGtQDUgNod6j7cXk6WBxG0QDov+mptC9ClmgJ1oO65
//fzuiXm64cEedHFCfAXWg7o5698btE3TzCLvgr4QE/sD/tp2+/KAOBjitbYU6AXWgfstO3wd0e6dvj78g
//EczQ7OGAP32WubZHWbp094Byox39HrT7fq9x6vd9WLf3eycHkJzDAXCA537f+FLj0wHkwwH3cAAc4O6A
//rg84w98AHlyh5iFcAVcMfi8Yf3d9+sLcis4OUHAAHDDwvTAQ/40vQS1c8QunD3Vl
