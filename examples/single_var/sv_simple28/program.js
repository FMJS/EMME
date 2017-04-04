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
      var x = new Int8Array(data.x_sab); id2_R_t1 = Atomics.load(x, 0); report.push("id2_R_t1: "+id2_R_t1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id3_R_t2 = Atomics.load(x, 0); report.push("id3_R_t2: "+id3_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t3 = Atomics.load(x, 0); report.push("id4_R_t3: "+id4_R_t3);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t4
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id5_R_t4 = Atomics.load(x, 0); report.push("id5_R_t4: "+id5_R_t4);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t5
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
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
      if (reports >= 5) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0";
outputs[1] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0";
outputs[2] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0";
outputs[3] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1";
outputs[4] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2";
outputs[5] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1";
outputs[6] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0";
outputs[7] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1";
outputs[8] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2";
outputs[9] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1";
outputs[10] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2";
outputs[11] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1";
outputs[12] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0";
outputs[13] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1";
outputs[14] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2";
outputs[15] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2";
outputs[16] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2";
outputs[17] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0";
outputs[18] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0";
outputs[19] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2";
outputs[20] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0";
outputs[21] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1";
outputs[22] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2";
outputs[23] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1";
outputs[24] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0";
outputs[25] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0";
outputs[26] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0";
outputs[27] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0";
outputs[28] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2";
outputs[29] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2";
outputs[30] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1";
outputs[31] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2";
outputs[32] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2";
outputs[33] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2";
outputs[34] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2";
outputs[35] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2";
outputs[36] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1";
outputs[37] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2";
outputs[38] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0";
outputs[39] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1";
outputs[40] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2";
outputs[41] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0";
outputs[42] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0";
outputs[43] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1";
outputs[44] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0";
outputs[45] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1";
outputs[46] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1";
outputs[47] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2";
outputs[48] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2";
outputs[49] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1";
outputs[50] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1";
outputs[51] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0";
outputs[52] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1";
outputs[53] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2";
outputs[54] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0";
outputs[55] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0";
outputs[56] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1";
outputs[57] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2";
outputs[58] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0";
outputs[59] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1";
outputs[60] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2";
outputs[61] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0";
outputs[62] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1";
outputs[63] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2";
outputs[64] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2";
outputs[65] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0";
outputs[66] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1";
outputs[67] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1";
outputs[68] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1";
outputs[69] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0";
outputs[70] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1";
outputs[71] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2";
outputs[72] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1";
outputs[73] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0";
outputs[74] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1";
outputs[75] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0";
outputs[76] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1";
outputs[77] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2";
outputs[78] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2";
outputs[79] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0";
outputs[80] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0";
assert(-1 != outputs.indexOf(report));

// Expected outputs //
//output// id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0
//output// id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0
//output// id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2
//output// id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1
//output// id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2
//output// id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2
//output// id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1
//output// id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0
//output// id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0
//output// id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1
//output// id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2
//output// id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2
//output// id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2
//output// id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1
//output// id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1
//output// id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1
//output// id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0
//output// id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1
//output// id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1
//output// id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0
//output// id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0
//output// id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1
//output// id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2
//output// id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2
//output// id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0
//output// id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0
