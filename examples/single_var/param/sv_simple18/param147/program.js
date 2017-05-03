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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[1] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 256;id7_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 256;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[7] = "id6_R_t2: 256;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0c2ZSUFxYpLhRoS66DEK6CFjrIl1J392kSUOanmg6maQX/105cyaXSfnI
///ETK5Sr+WsVSiij0g2kQq1sxvIvC0fa3lItlOP9IGp7G4l58X0ehCmZB7A2SGbT5dTMQO1XNVk2pSmwv
//sb2arWbXmlazK82qXtKxeI8+07oqdZfrVFPXNXVTU/drzptfz1o8vDyK51esWfM1q9y9z1bLvcT2Etur
//2V7N9hq211R7s2c8HU82D3lnhbd3l8wcprPrBr18cMQNqt8GaXv6Sf4XY4/Pz85mvs3SmesrCQSAABDo
//FAFvD4FimYfdE8Cc1RoGZXzQABpAQ3fvB8Vyen3SQKABNICGo9Ow92LQFwyKfeDtWShvJRRQAApA4Th5
//Au0NFguuWqQJlXp+TMAAGADDOWQMLlhonDBYY7G7uQAX4AJcHCV3cMsFgQtwAS4uNYuww8IqiXCyDTEe
//qAAVoOJkvngoFpbcJRQGNIAG0HDe30EcDoNtRmEsNx0AA2AAjJP5OqINGAQwAAbA+E/fTDThwkVOYbsZ
//0aACVICKHnOKUnLpMqXQLBdgASyAhdPPKJyi8FdC0ZaK6nYDWAALYNFfPtERFgQsgAWwuKhsoiUVhyQT
//zaH4AWW8Yig=
