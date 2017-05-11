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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 <= id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
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
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm09vgjAYxu/7FBw1MUH7Sk22eNBsZof9SXSLR7KMHUim7oCnZd99CDgrK5NC67A+t+ZFHuhLf3no
//E3Td1Tr6WEeu64RB35/6Ebt02FUYeNm4G48H27HrLlbB23v849uxM3Q+W2HA/Lkf9Trx2ZSM2h2ntVXa
//VFOdfHUgVD1ptRerLV7C5abOBGWxTgX1foGOV1DPrvvljB6unftH+2aW1Hfz6UurnrQqKpBUgaQKlFdI
//uzsdT5L27vXsZ7bdzbl7jdtORjg4kB/M9CfZ05OoFwnLNVO92Xyjl46T3r6ulsFwMrqb3bQvXMADeBoM
//D8sf0oOO2HeAA3DOzHUEqjR5TqYIcACOvY5THRu53xiChgEaQNMgtyHtbkMAB+DY7jak2W1qQtPNQcM1
//vaKZXi67q3Lp0uUFGrw2NKZnprLgVZZ2zY7l7oJLr8cPQiOxlD/9hisGA/veUuQ5XC0ceJo+gx/w0wR+
//mNLbmio9rMT7GtgBOxZ6zy+wdDmP+JzADtixzndqk8MObnfMcMPADbj5T88hU55DYAfs2Ow5ZMZzzHDD
//wA24OSI3ZJAbOiI32OOAm9PIpst8QqCaTJf4jADsgJ0Tz6XLkKOWSoMbcGN/Jl3HceTJGrgBN7bn0dXd
//xjQzyAXATFOz6DpeQ+AG3JxlDl3da0wwgwwazDQ/g67+Vxw64p6GgRkw06j8mQzkzwR2wI71+TNpz5/B
//DbixP38m7fkzuAE3tufPpDl/JiM5GpgBM03Kn0l7/gxuwI3t+TNpzp/JSP4MZsBMc/Jn0pw/l2XmGzkR
//c+s=
