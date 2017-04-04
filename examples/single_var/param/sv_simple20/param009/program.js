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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[0] = "id8_R_t3: 33685506;id9_R_t3: 514";
outputs[1] = "id8_R_t3: 33685506;id9_R_t3: 512";
outputs[2] = "id8_R_t3: 2;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 2;id9_R_t3: 2";
outputs[4] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 131074;id9_R_t3: 514";
outputs[6] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[7] = "id8_R_t3: 131074;id9_R_t3: 512";
outputs[8] = "id8_R_t3: 33554946;id9_R_t3: 0";
outputs[9] = "id8_R_t3: 33554946;id9_R_t3: 2";
outputs[10] = "id8_R_t3: 33554944;id9_R_t3: 514";
outputs[11] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[12] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[13] = "id8_R_t3: 0;id9_R_t3: 514";
outputs[14] = "id8_R_t3: 131586;id9_R_t3: 0";
outputs[15] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[16] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[17] = "id8_R_t3: 33554434;id9_R_t3: 0";
outputs[18] = "id8_R_t3: 33685504;id9_R_t3: 512";
outputs[19] = "id8_R_t3: 2;id9_R_t3: 514";
outputs[20] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[21] = "id8_R_t3: 33554946;id9_R_t3: 512";
outputs[22] = "id8_R_t3: 33686016;id9_R_t3: 2";
outputs[23] = "id8_R_t3: 33686016;id9_R_t3: 0";
outputs[24] = "id8_R_t3: 33685504;id9_R_t3: 0";
outputs[25] = "id8_R_t3: 33686018;id9_R_t3: 2";
outputs[26] = "id8_R_t3: 33685504;id9_R_t3: 2";
outputs[27] = "id8_R_t3: 33686018;id9_R_t3: 0";
outputs[28] = "id8_R_t3: 514;id9_R_t3: 2";
outputs[29] = "id8_R_t3: 514;id9_R_t3: 0";
outputs[30] = "id8_R_t3: 131584;id9_R_t3: 512";
outputs[31] = "id8_R_t3: 33554432;id9_R_t3: 0";
outputs[32] = "id8_R_t3: 512;id9_R_t3: 514";
outputs[33] = "id8_R_t3: 0;id9_R_t3: 0";
outputs[34] = "id8_R_t3: 33554434;id9_R_t3: 2";
outputs[35] = "id8_R_t3: 33554944;id9_R_t3: 2";
outputs[36] = "id8_R_t3: 131584;id9_R_t3: 514";
outputs[37] = "id8_R_t3: 33554944;id9_R_t3: 0";
outputs[38] = "id8_R_t3: 131074;id9_R_t3: 2";
outputs[39] = "id8_R_t3: 131074;id9_R_t3: 0";
outputs[40] = "id8_R_t3: 512;id9_R_t3: 512";
outputs[41] = "id8_R_t3: 33685504;id9_R_t3: 514";
outputs[42] = "id8_R_t3: 33554944;id9_R_t3: 512";
outputs[43] = "id8_R_t3: 2;id9_R_t3: 512";
outputs[44] = "id8_R_t3: 131586;id9_R_t3: 2";
outputs[45] = "id8_R_t3: 33554946;id9_R_t3: 514";
outputs[46] = "id8_R_t3: 131072;id9_R_t3: 514";
outputs[47] = "id8_R_t3: 33554432;id9_R_t3: 514";
outputs[48] = "id8_R_t3: 33686016;id9_R_t3: 512";
outputs[49] = "id8_R_t3: 33554434;id9_R_t3: 514";
outputs[50] = "id8_R_t3: 131072;id9_R_t3: 512";
outputs[51] = "id8_R_t3: 33554432;id9_R_t3: 512";
outputs[52] = "id8_R_t3: 33685506;id9_R_t3: 2";
outputs[53] = "id8_R_t3: 33685506;id9_R_t3: 0";
outputs[54] = "id8_R_t3: 33686018;id9_R_t3: 514";
outputs[55] = "id8_R_t3: 131586;id9_R_t3: 514";
outputs[56] = "id8_R_t3: 33554432;id9_R_t3: 2";
outputs[57] = "id8_R_t3: 33554434;id9_R_t3: 512";
outputs[58] = "id8_R_t3: 131586;id9_R_t3: 512";
outputs[59] = "id8_R_t3: 33686016;id9_R_t3: 514";
outputs[60] = "id8_R_t3: 0;id9_R_t3: 512";
outputs[61] = "id8_R_t3: 514;id9_R_t3: 512";
outputs[62] = "id8_R_t3: 33686018;id9_R_t3: 512";
outputs[63] = "id8_R_t3: 514;id9_R_t3: 514";
assert(-1 != outputs.indexOf(report));

// Expected outputs //
//output// id8_R_t3: 33685506;id9_R_t3: 514
//output// id8_R_t3: 33685506;id9_R_t3: 512
//output// id8_R_t3: 2;id9_R_t3: 0
//output// id8_R_t3: 2;id9_R_t3: 2
//output// id8_R_t3: 512;id9_R_t3: 0
//output// id8_R_t3: 131074;id9_R_t3: 514
//output// id8_R_t3: 512;id9_R_t3: 2
//output// id8_R_t3: 131074;id9_R_t3: 512
//output// id8_R_t3: 33554946;id9_R_t3: 0
//output// id8_R_t3: 33554946;id9_R_t3: 2
//output// id8_R_t3: 33554944;id9_R_t3: 514
//output// id8_R_t3: 131584;id9_R_t3: 2
//output// id8_R_t3: 131584;id9_R_t3: 0
//output// id8_R_t3: 0;id9_R_t3: 514
//output// id8_R_t3: 131586;id9_R_t3: 0
//output// id8_R_t3: 0;id9_R_t3: 2
//output// id8_R_t3: 131072;id9_R_t3: 2
//output// id8_R_t3: 33554434;id9_R_t3: 0
//output// id8_R_t3: 33685504;id9_R_t3: 512
//output// id8_R_t3: 2;id9_R_t3: 514
//output// id8_R_t3: 131072;id9_R_t3: 0
//output// id8_R_t3: 33554946;id9_R_t3: 512
//output// id8_R_t3: 33686016;id9_R_t3: 2
//output// id8_R_t3: 33686016;id9_R_t3: 0
//output// id8_R_t3: 33685504;id9_R_t3: 0
//output// id8_R_t3: 33686018;id9_R_t3: 2
//output// id8_R_t3: 33685504;id9_R_t3: 2
//output// id8_R_t3: 33686018;id9_R_t3: 0
//output// id8_R_t3: 514;id9_R_t3: 2
//output// id8_R_t3: 514;id9_R_t3: 0
//output// id8_R_t3: 131584;id9_R_t3: 512
//output// id8_R_t3: 33554432;id9_R_t3: 0
//output// id8_R_t3: 512;id9_R_t3: 514
//output// id8_R_t3: 0;id9_R_t3: 0
//output// id8_R_t3: 33554434;id9_R_t3: 2
//output// id8_R_t3: 33554944;id9_R_t3: 2
//output// id8_R_t3: 131584;id9_R_t3: 514
//output// id8_R_t3: 33554944;id9_R_t3: 0
//output// id8_R_t3: 131074;id9_R_t3: 2
//output// id8_R_t3: 131074;id9_R_t3: 0
//output// id8_R_t3: 512;id9_R_t3: 512
//output// id8_R_t3: 33685504;id9_R_t3: 514
//output// id8_R_t3: 33554944;id9_R_t3: 512
//output// id8_R_t3: 2;id9_R_t3: 512
//output// id8_R_t3: 131586;id9_R_t3: 2
//output// id8_R_t3: 33554946;id9_R_t3: 514
//output// id8_R_t3: 131072;id9_R_t3: 514
//output// id8_R_t3: 33554432;id9_R_t3: 514
//output// id8_R_t3: 33686016;id9_R_t3: 512
//output// id8_R_t3: 33554434;id9_R_t3: 514
//output// id8_R_t3: 131072;id9_R_t3: 512
//output// id8_R_t3: 33554432;id9_R_t3: 512
//output// id8_R_t3: 33685506;id9_R_t3: 2
//output// id8_R_t3: 33685506;id9_R_t3: 0
//output// id8_R_t3: 33686018;id9_R_t3: 514
//output// id8_R_t3: 131586;id9_R_t3: 514
//output// id8_R_t3: 33554432;id9_R_t3: 2
//output// id8_R_t3: 33554434;id9_R_t3: 512
//output// id8_R_t3: 131586;id9_R_t3: 512
//output// id8_R_t3: 33686016;id9_R_t3: 514
//output// id8_R_t3: 0;id9_R_t3: 512
//output// id8_R_t3: 514;id9_R_t3: 512
//output// id8_R_t3: 33686018;id9_R_t3: 512
//output// id8_R_t3: 514;id9_R_t3: 514
