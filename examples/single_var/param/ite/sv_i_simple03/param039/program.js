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
   `$262.agent.receiveBroadcast(function (x_sab) {
      var report = [];
      var x = new Int8Array(x_sab); x[0] = 1;
      var x = new Int8Array(x_sab); x[0] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (x_sab) {
      var report = [];
      var x = new Int8Array(x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 <= id5_R_t2) {
         var x = new Int8Array(x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);
var x_sab = new SharedArrayBuffer(8);
$262.agent.broadcast(x_sab);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      thread_report = thread_report.split(",");
      for(i=0; i < thread_report.length; i++){
         if(thread_report[i] == "") continue;
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[8] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 2";
outputs[9] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[10] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[11] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[12] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[13] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 0";
outputs[14] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[15] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[16] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
outputs[17] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
outputs[18] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 1";
outputs[19] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 1";
outputs[20] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 1";
outputs[21] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[22] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 2";
outputs[23] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 2";
outputs[24] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
outputs[25] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 2";
outputs[26] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));
