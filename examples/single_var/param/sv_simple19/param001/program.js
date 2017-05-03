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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id8_R_t3 = Atomics.load(x, 0); report.push("id8_R_t3: "+id8_R_t3);
      var x = new Int16Array(data.x_sab); id9_R_t3 = Atomics.load(x, 1); report.push("id9_R_t3: "+id9_R_t3);
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
outputs[0] = "id8_R_t3: 0;id9_R_t3: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
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
