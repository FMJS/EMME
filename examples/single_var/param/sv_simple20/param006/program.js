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
outputs[0] = "id8_R_t3: 2;id9_R_t3: 1";
outputs[1] = "id8_R_t3: 2;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 2;id9_R_t3: 2";
outputs[3] = "id8_R_t3: 16843010;id9_R_t3: 258";
outputs[4] = "id8_R_t3: 258;id9_R_t3: 258";
outputs[5] = "id8_R_t3: 2;id9_R_t3: 257";
outputs[6] = "id8_R_t3: 65794;id9_R_t3: 2";
outputs[7] = "id8_R_t3: 16843008;id9_R_t3: 258";
outputs[8] = "id8_R_t3: 65794;id9_R_t3: 1";
outputs[9] = "id8_R_t3: 256;id9_R_t3: 2";
outputs[10] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[11] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[12] = "id8_R_t3: 258;id9_R_t3: 257";
outputs[13] = "id8_R_t3: 131330;id9_R_t3: 1";
outputs[14] = "id8_R_t3: 66050;id9_R_t3: 2";
outputs[15] = "id8_R_t3: 131586;id9_R_t3: 1";
outputs[16] = "id8_R_t3: 0;id9_R_t3: 1";
outputs[17] = "id8_R_t3: 0;id9_R_t3: 0";
outputs[18] = "id8_R_t3: 131586;id9_R_t3: 257";
outputs[19] = "id8_R_t3: 16843008;id9_R_t3: 257";
outputs[20] = "id8_R_t3: 131330;id9_R_t3: 2";
outputs[21] = "id8_R_t3: 66050;id9_R_t3: 1";
outputs[22] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[23] = "id8_R_t3: 131330;id9_R_t3: 257";
outputs[24] = "id8_R_t3: 16843010;id9_R_t3: 257";
outputs[25] = "id8_R_t3: 514;id9_R_t3: 2";
outputs[26] = "id8_R_t3: 514;id9_R_t3: 1";
outputs[27] = "id8_R_t3: 514;id9_R_t3: 0";
outputs[28] = "id8_R_t3: 16908546;id9_R_t3: 257";
outputs[29] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[30] = "id8_R_t3: 65792;id9_R_t3: 2";
outputs[31] = "id8_R_t3: 16908802;id9_R_t3: 257";
outputs[32] = "id8_R_t3: 66050;id9_R_t3: 258";
outputs[33] = "id8_R_t3: 66050;id9_R_t3: 257";
outputs[34] = "id8_R_t3: 16908802;id9_R_t3: 258";
outputs[35] = "id8_R_t3: 131330;id9_R_t3: 258";
outputs[36] = "id8_R_t3: 131586;id9_R_t3: 2";
outputs[37] = "id8_R_t3: 16843266;id9_R_t3: 258";
outputs[38] = "id8_R_t3: 256;id9_R_t3: 258";
outputs[39] = "id8_R_t3: 65794;id9_R_t3: 257";
outputs[40] = "id8_R_t3: 258;id9_R_t3: 0";
outputs[41] = "id8_R_t3: 258;id9_R_t3: 1";
outputs[42] = "id8_R_t3: 258;id9_R_t3: 2";
outputs[43] = "id8_R_t3: 65794;id9_R_t3: 258";
outputs[44] = "id8_R_t3: 16843266;id9_R_t3: 257";
outputs[45] = "id8_R_t3: 0;id9_R_t3: 258";
outputs[46] = "id8_R_t3: 16908546;id9_R_t3: 258";
outputs[47] = "id8_R_t3: 2;id9_R_t3: 258";
outputs[48] = "id8_R_t3: 0;id9_R_t3: 257";
outputs[49] = "id8_R_t3: 514;id9_R_t3: 258";
outputs[50] = "id8_R_t3: 65792;id9_R_t3: 258";
outputs[51] = "id8_R_t3: 256;id9_R_t3: 257";
outputs[52] = "id8_R_t3: 514;id9_R_t3: 257";
outputs[53] = "id8_R_t3: 65792;id9_R_t3: 257";
outputs[54] = "id8_R_t3: 131586;id9_R_t3: 258";
assert(-1 != outputs.indexOf(report));

// Expected outputs //
//output// id8_R_t3: 2;id9_R_t3: 1
//output// id8_R_t3: 2;id9_R_t3: 0
//output// id8_R_t3: 2;id9_R_t3: 2
//output// id8_R_t3: 16843010;id9_R_t3: 258
//output// id8_R_t3: 258;id9_R_t3: 258
//output// id8_R_t3: 2;id9_R_t3: 257
//output// id8_R_t3: 65794;id9_R_t3: 2
//output// id8_R_t3: 16843008;id9_R_t3: 258
//output// id8_R_t3: 65794;id9_R_t3: 1
//output// id8_R_t3: 256;id9_R_t3: 2
//output// id8_R_t3: 256;id9_R_t3: 0
//output// id8_R_t3: 256;id9_R_t3: 1
//output// id8_R_t3: 258;id9_R_t3: 257
//output// id8_R_t3: 131330;id9_R_t3: 1
//output// id8_R_t3: 66050;id9_R_t3: 2
//output// id8_R_t3: 131586;id9_R_t3: 1
//output// id8_R_t3: 0;id9_R_t3: 1
//output// id8_R_t3: 0;id9_R_t3: 0
//output// id8_R_t3: 131586;id9_R_t3: 257
//output// id8_R_t3: 16843008;id9_R_t3: 257
//output// id8_R_t3: 131330;id9_R_t3: 2
//output// id8_R_t3: 66050;id9_R_t3: 1
//output// id8_R_t3: 0;id9_R_t3: 2
//output// id8_R_t3: 131330;id9_R_t3: 257
//output// id8_R_t3: 16843010;id9_R_t3: 257
//output// id8_R_t3: 514;id9_R_t3: 2
//output// id8_R_t3: 514;id9_R_t3: 1
//output// id8_R_t3: 514;id9_R_t3: 0
//output// id8_R_t3: 16908546;id9_R_t3: 257
//output// id8_R_t3: 65792;id9_R_t3: 1
//output// id8_R_t3: 65792;id9_R_t3: 2
//output// id8_R_t3: 16908802;id9_R_t3: 257
//output// id8_R_t3: 66050;id9_R_t3: 258
//output// id8_R_t3: 66050;id9_R_t3: 257
//output// id8_R_t3: 16908802;id9_R_t3: 258
//output// id8_R_t3: 131330;id9_R_t3: 258
//output// id8_R_t3: 131586;id9_R_t3: 2
//output// id8_R_t3: 16843266;id9_R_t3: 258
//output// id8_R_t3: 256;id9_R_t3: 258
//output// id8_R_t3: 65794;id9_R_t3: 257
//output// id8_R_t3: 258;id9_R_t3: 0
//output// id8_R_t3: 258;id9_R_t3: 1
//output// id8_R_t3: 258;id9_R_t3: 2
//output// id8_R_t3: 65794;id9_R_t3: 258
//output// id8_R_t3: 16843266;id9_R_t3: 257
//output// id8_R_t3: 0;id9_R_t3: 258
//output// id8_R_t3: 16908546;id9_R_t3: 258
//output// id8_R_t3: 2;id9_R_t3: 258
//output// id8_R_t3: 0;id9_R_t3: 257
//output// id8_R_t3: 514;id9_R_t3: 258
//output// id8_R_t3: 65792;id9_R_t3: 258
//output// id8_R_t3: 256;id9_R_t3: 257
//output// id8_R_t3: 514;id9_R_t3: 257
//output// id8_R_t3: 65792;id9_R_t3: 257
//output// id8_R_t3: 131586;id9_R_t3: 258
