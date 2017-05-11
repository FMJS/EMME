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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 1);
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
outputs[1] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 65536;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 65792;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 16777216;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 16777472;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 16842752;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 16843008;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 0;id9_R_t3: 1";
outputs[9] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[10] = "id8_R_t3: 65536;id9_R_t3: 1";
outputs[11] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[12] = "id8_R_t3: 16777216;id9_R_t3: 1";
outputs[13] = "id8_R_t3: 16777472;id9_R_t3: 1";
outputs[14] = "id8_R_t3: 16842752;id9_R_t3: 1";
outputs[15] = "id8_R_t3: 16843008;id9_R_t3: 1";
outputs[16] = "id8_R_t3: 0;id9_R_t3: 256";
outputs[17] = "id8_R_t3: 256;id9_R_t3: 256";
outputs[18] = "id8_R_t3: 65536;id9_R_t3: 256";
outputs[19] = "id8_R_t3: 65792;id9_R_t3: 256";
outputs[20] = "id8_R_t3: 16777216;id9_R_t3: 256";
outputs[21] = "id8_R_t3: 16777472;id9_R_t3: 256";
outputs[22] = "id8_R_t3: 16842752;id9_R_t3: 256";
outputs[23] = "id8_R_t3: 16843008;id9_R_t3: 256";
outputs[24] = "id8_R_t3: 0;id9_R_t3: 257";
outputs[25] = "id8_R_t3: 256;id9_R_t3: 257";
outputs[26] = "id8_R_t3: 65536;id9_R_t3: 257";
outputs[27] = "id8_R_t3: 65792;id9_R_t3: 257";
outputs[28] = "id8_R_t3: 16777216;id9_R_t3: 257";
outputs[29] = "id8_R_t3: 16777472;id9_R_t3: 257";
outputs[30] = "id8_R_t3: 16842752;id9_R_t3: 257";
outputs[31] = "id8_R_t3: 16843008;id9_R_t3: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
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
