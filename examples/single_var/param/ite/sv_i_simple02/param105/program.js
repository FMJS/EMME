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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 >= 2) {
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 0;id8_R_t2: 2";
outputs[2] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmDtvgzAUhff+Co+JFMnBD1y1ypCoRR36kJJGGVFVOiA1oQOZqv73AobUQdfCIa7CcDfrcC5crv3p
//ICjN9vnXPqeUpEkYL+Oc3ZDpbZpcN2tKt1ny8VkYHhZkRr5HacLiTZwHk6KCV6vxhBypAlSloXLQy0Gv
//AFXda6nqTrUaFI7tW7ordWa4TZ1bdGHRpUUPLc+t+/kh8+c78vSCM3OfWevtQ1A1vRz0ctArQK8AvRL0
//yrZX7/FyEVWbfDTh5u2KymlZPWqKWheD5iZRfVDAW8DVunK1KSv1uhrre7ZLZtH8cXU/vqLIN/KNfPvn
//+zCZvnSbo/0nthmyjWwj236z+zDOHsld1yLbyDayPbjcdiEbTm2PXOP3OHKNXHvObHlGZktkG9lGtgea
//2bJ3Zp/JNSu4VgPn+lKn8W/0ynJG1WC5vtTMWAd9YSd9MGfOe9HqQoFdKLALBXahOrlmba4VHOdWss0N
//Uqf9Q3tdrl3QZog2oo1o+0TbuHQi2Kw7sh2xxsRGrBFrr1iL3lgLR6x/AfNAL0Q=
