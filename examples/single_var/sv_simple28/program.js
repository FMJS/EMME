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
outputs[0] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0";
outputs[1] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0";
outputs[2] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0";
outputs[3] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0";
outputs[4] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0";
outputs[5] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0";
outputs[6] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0";
outputs[7] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0";
outputs[8] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0";
outputs[9] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0";
outputs[10] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0";
outputs[11] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0";
outputs[12] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0";
outputs[13] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0";
outputs[14] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0";
outputs[15] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0";
outputs[16] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0";
outputs[17] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0";
outputs[18] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0";
outputs[19] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0";
outputs[20] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0";
outputs[21] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0";
outputs[22] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0";
outputs[23] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0";
outputs[24] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0";
outputs[25] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0";
outputs[26] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0";
outputs[27] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1";
outputs[28] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1";
outputs[29] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1";
outputs[30] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1";
outputs[31] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1";
outputs[32] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1";
outputs[33] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1";
outputs[34] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1";
outputs[35] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1";
outputs[36] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1";
outputs[37] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1";
outputs[38] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1";
outputs[39] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1";
outputs[40] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1";
outputs[41] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1";
outputs[42] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1";
outputs[43] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1";
outputs[44] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1";
outputs[45] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1";
outputs[46] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1";
outputs[47] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1";
outputs[48] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1";
outputs[49] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1";
outputs[50] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1";
outputs[51] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1";
outputs[52] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1";
outputs[53] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1";
outputs[54] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2";
outputs[55] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2";
outputs[56] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2";
outputs[57] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2";
outputs[58] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2";
outputs[59] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2";
outputs[60] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2";
outputs[61] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2";
outputs[62] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2";
outputs[63] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2";
outputs[64] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2";
outputs[65] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2";
outputs[66] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2";
outputs[67] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2";
outputs[68] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2";
outputs[69] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2";
outputs[70] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2";
outputs[71] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2";
outputs[72] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2";
outputs[73] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2";
outputs[74] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2";
outputs[75] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2";
outputs[76] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2";
outputs[77] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2";
outputs[78] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2";
outputs[79] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2";
outputs[80] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
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
//DXX1gsp4xphCZ2udMgVfHkv3PwfjX74=
