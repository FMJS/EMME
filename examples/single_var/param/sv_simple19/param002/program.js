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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
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
outputs[1] = "id8_R_t3: 1;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 257;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 65536;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 65537;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 65792;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 65793;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 0;id9_R_t3: 1";
outputs[9] = "id8_R_t3: 1;id9_R_t3: 1";
outputs[10] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[11] = "id8_R_t3: 257;id9_R_t3: 1";
outputs[12] = "id8_R_t3: 65536;id9_R_t3: 1";
outputs[13] = "id8_R_t3: 65537;id9_R_t3: 1";
outputs[14] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[15] = "id8_R_t3: 65793;id9_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
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
