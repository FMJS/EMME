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
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
