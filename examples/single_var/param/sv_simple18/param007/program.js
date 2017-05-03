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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rwkAQBuB7f8UeWxDW3ckqtPRQKdJLW7AHj6EQD4Fae4in4n9vYj6IOmnjZmOS8t5kdtbEjTwM
//L5Fys42+tpGUIgwm/sKP9K0Y34XBNP8s5XoTrD7ihqeZuBff12Gg/aUfqVG8g/afbkbioOqxVVOqEttL
//bK/HVtN7TarpnaZVFXes38PPpK5L3eU6VdS9irqpqE8qrpvdz048vDyK51ecWf0zO/r1E7Za7iW2l9he
//j+312F7D9prj3vQZL2bz/UM+OOH818U7x8nuqkWVLU65Rf3bIuWXn2d/Mfb7+d3pzrdlsnN3JTkEFBAA
//AkDAFQLqBIHimMftE8Bc1RoGTAeAATC0OB0Ux6kuCQM1hgETA2AADM1gOBkKLsWCZh84YVoACkDhP2QJ
//dLJYHLhukCQc1bPvxLQAGADDEPIFFyzUThesscAUASyAReeZg1ssqCUsMFkAC2DRcQ5hR4VVCuFkqjBK
//gwpQASr68qZDcbDkLp0wVjMEaAANoKE37z+cD4NtPmEwSYALcDHstyKacEEtcYHpAlyAix6+K1EHCxcZ
//BSYLUAEqhpBRlFJLlwmFx3KBCQIsgIX+5xNOUfgrnWhKBSYIUAEqusomWqKCWqECUwWoABXd5BINoTgn
//lajPxA8/UV64
