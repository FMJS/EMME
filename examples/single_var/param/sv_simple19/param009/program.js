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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 2);
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
outputs[1] = "id8_R_t3: 2;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 514;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 131074;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 131586;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 33554432;id9_R_t3: 0";
outputs[9] = "id8_R_t3: 33554434;id9_R_t3: 0";
outputs[10] = "id8_R_t3: 33554944;id9_R_t3: 0";
outputs[11] = "id8_R_t3: 33554946;id9_R_t3: 0";
outputs[12] = "id8_R_t3: 33685504;id9_R_t3: 0";
outputs[13] = "id8_R_t3: 33685506;id9_R_t3: 0";
outputs[14] = "id8_R_t3: 33686016;id9_R_t3: 0";
outputs[15] = "id8_R_t3: 33686018;id9_R_t3: 0";
outputs[16] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[17] = "id8_R_t3: 2;id9_R_t3: 2";
outputs[18] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[19] = "id8_R_t3: 514;id9_R_t3: 2";
outputs[20] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[21] = "id8_R_t3: 131074;id9_R_t3: 2";
outputs[22] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[23] = "id8_R_t3: 131586;id9_R_t3: 2";
outputs[24] = "id8_R_t3: 33554432;id9_R_t3: 2";
outputs[25] = "id8_R_t3: 33554434;id9_R_t3: 2";
outputs[26] = "id8_R_t3: 33554944;id9_R_t3: 2";
outputs[27] = "id8_R_t3: 33554946;id9_R_t3: 2";
outputs[28] = "id8_R_t3: 33685504;id9_R_t3: 2";
outputs[29] = "id8_R_t3: 33685506;id9_R_t3: 2";
outputs[30] = "id8_R_t3: 33686016;id9_R_t3: 2";
outputs[31] = "id8_R_t3: 33686018;id9_R_t3: 2";
outputs[32] = "id8_R_t3: 0;id9_R_t3: 512";
outputs[33] = "id8_R_t3: 2;id9_R_t3: 512";
outputs[34] = "id8_R_t3: 512;id9_R_t3: 512";
outputs[35] = "id8_R_t3: 514;id9_R_t3: 512";
outputs[36] = "id8_R_t3: 131072;id9_R_t3: 512";
outputs[37] = "id8_R_t3: 131074;id9_R_t3: 512";
outputs[38] = "id8_R_t3: 131584;id9_R_t3: 512";
outputs[39] = "id8_R_t3: 131586;id9_R_t3: 512";
outputs[40] = "id8_R_t3: 33554432;id9_R_t3: 512";
outputs[41] = "id8_R_t3: 33554434;id9_R_t3: 512";
outputs[42] = "id8_R_t3: 33554944;id9_R_t3: 512";
outputs[43] = "id8_R_t3: 33554946;id9_R_t3: 512";
outputs[44] = "id8_R_t3: 33685504;id9_R_t3: 512";
outputs[45] = "id8_R_t3: 33685506;id9_R_t3: 512";
outputs[46] = "id8_R_t3: 33686016;id9_R_t3: 512";
outputs[47] = "id8_R_t3: 33686018;id9_R_t3: 512";
outputs[48] = "id8_R_t3: 0;id9_R_t3: 514";
outputs[49] = "id8_R_t3: 2;id9_R_t3: 514";
outputs[50] = "id8_R_t3: 512;id9_R_t3: 514";
outputs[51] = "id8_R_t3: 514;id9_R_t3: 514";
outputs[52] = "id8_R_t3: 131072;id9_R_t3: 514";
outputs[53] = "id8_R_t3: 131074;id9_R_t3: 514";
outputs[54] = "id8_R_t3: 131584;id9_R_t3: 514";
outputs[55] = "id8_R_t3: 131586;id9_R_t3: 514";
outputs[56] = "id8_R_t3: 33554432;id9_R_t3: 514";
outputs[57] = "id8_R_t3: 33554434;id9_R_t3: 514";
outputs[58] = "id8_R_t3: 33554944;id9_R_t3: 514";
outputs[59] = "id8_R_t3: 33554946;id9_R_t3: 514";
outputs[60] = "id8_R_t3: 33685504;id9_R_t3: 514";
outputs[61] = "id8_R_t3: 33685506;id9_R_t3: 514";
outputs[62] = "id8_R_t3: 33686016;id9_R_t3: 514";
outputs[63] = "id8_R_t3: 33686018;id9_R_t3: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
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
