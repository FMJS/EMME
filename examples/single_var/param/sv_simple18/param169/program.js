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
      var x = new Int8Array(data.x_sab); x[3] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoVNdnZbUDxYpHhRoR56DEI8BKz1kJ6k/92kSUPSTjTZbD4O763MzjbJpjyU
//l5Fyt4+/97GUIgrnwTqI1a3w7qJwcfos5XYXfnwmDU9LcS9+rqNQBZsg9mfJDjp+upmJSlWzVVOqEttL
//bK9mq9m9ptXsTrOqn3Rs36OvtK5K3eU61dR1Td3U1Oc1183v5yAeXh7F8yvOrPmZnT39nK2We4ntJbZX
//s72a7TVsrznvzd7xerk6vuTKCZ+eLtnppbvrFv18ccEtqr8W6XT5Vf4TY7+f353tfNukOw9XkkNAAQEg
//AARcIeBfIFAcs9c/AcxVrWEwPmgADaChx/8HxXH6Q9JADmjQoAE0gIZONFz8MRgKBsW+8O4slPMEBRSA
//AlAYJ0+gi8XiwFWHNOGsnn9ny4wBMAAGwDBKxuCChcYJgzUW1dwBXIALcDFK7uCWC+qNCw0uwAW4GDeL
//sMPCKomwpgLzDoACUExy3qE4WHKXTxirfAIwAAbAMJEZiPYs2OYTxjKfABfgAlxMZC6iCxfUGxeYlQAX
//4GJysxJNsHCRTxirfAJBJqAAFEPmE6W80mU6oVksDGYngAJQmHg24ZSE/5KJrlBgbgJUgIqxcomeqKCe
//qMDMBKgAFWNkEh2haJNINGfiFwe6XtA=
