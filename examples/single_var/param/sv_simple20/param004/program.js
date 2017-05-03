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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
//z9OUlQ==
