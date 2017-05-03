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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id8_R_t3 = x[0]; report.push("id8_R_t3: "+id8_R_t3);
      var x = new Int16Array(data.x_sab); id9_R_t3 = x[1]; report.push("id9_R_t3: "+id9_R_t3);
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
//pfO+2kngf2kWoB4=
