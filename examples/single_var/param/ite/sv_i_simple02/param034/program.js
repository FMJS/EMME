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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 <= 0) {
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
outputs[0] = "id6_R_t2: 2;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 2;id8_R_t2: 2";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlktPg0AUhff+ilm2SZOBeTBG00UbJS58JFTTJTHigsQWF3Rl/O8CA3VK7gi0KJjc3eTMuXC5M18O
//lCa79H2XUkriyAuDMGUXhF3G0Xm5dijdJNHrW2a4WZI5+ZjEEQvXYerOsgperKYzcqAKUJWGykEvB70C
//VHWvuao71aqbOTbP8TbXmeE2dW7RhUWXFt2zvLfs55Ms7q/I3QPOrP3Mal/vgarp5aCXg14BegXolaBX
//1r36jIOlXxzywYT3k3Hy2klVkm9VH55tuNUj/PKaAA+Aa3Xdap3X6XUx0pdkG839xe3qenpGkW1kG9n+
//U7b3w+xMdlnZB9cMuUaukes+uZZHcy1P49rJuFYjz+uhbuP36JXljqrRcj3UzFgDfV4jfTBnrc+i1oUC
//u1BgFwrsQjVybfxwV2QreNPKtuGCq3/i+zF4QrwRb8T7d/Bm9djuCrd5QIg2oo1o/4vkNrjvnNus+a8c
//0Ua0Ee0hUrsN2HBm94c1Q6wRa8S638QWJyS2QLQRbUR7nIktjk7stlh/AbpELps=
