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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 <= 1) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
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
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtljFrwzAQhff+Co0JBBRblwhaMjS0oUtbcFoymlJ1MDRxB2cq/e+1LTvI6RlcW4YMbzue74mT5A89
//KdNj9nXMpBSJWcZRnIXXYn6TGF3XUu5T8/GZNzysxUp8TxITxrs4C2a5Q5XVdCYaKrHqwlEV26vYXmLV
//IK/3b8mh0MMWXbXo1KK3rW/Pxeq2LlTtqG53pf+I26c78fiMM3P246qKVYlVF6za+S7OptDsFJqdQrNT
//NO44Wm/KS25MVE+RO+eFe1Kb/nysFtlUPwq7BO+2zu2ucNq63P57ejCrl+j1fnolgTfwBt7+8T6db1+4
//3Qvyh3YAtIE20B6ENg1Fm0ZBG6820AbaI4Zy50n/dySvvEAbaAPtSwvkXcDm4/gwrBHGgTWwHi2Md8Ga
//RsDafa0DYA2sgbXfIE4DgjgBbaANtC8ziFPvIE7egjiwBtbA2msQp95BvCvWv2Y5Lew=
