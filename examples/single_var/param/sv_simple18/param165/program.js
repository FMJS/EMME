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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 513;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 513;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoXN7mRbUDxYpHhRoR56DEI8BKz1kJ6k/92kSUPSTjTZbD4O763MzjbJpjyU
//l5Fyt4+/97GUIgrnwTqI9a3w7qJwcfos5XYXfnwmDU9LcS9+rqNQB5sgVrNkBx0/3cxEpeqzVVOqEttL
//bK/PVrN7TavZnWZVlXRs36OvtK5L3eU61dT9mrqpqc9rrpvfz0E8vDyK51ecWfMzO3v6OVst9xLbS2yv
//z/b6bK9he815b/aO18vV8SVXTvj0dMlOL91dt6jyxQW3qP9apNPlV/lPjP1+fne2822T7jxcSQ4BBQSA
//ABBwhYC6QKA4Zq9/ApirWsNglAYNoAE09Pf/oDhONSQN5IAGAg2gATR0ouHij8FQMGj2hXdnoZwnaKAA
//FIDCOHkCXSwWB647pAln9fw7W2YMgAEwAIZRMgYXLDROGKyxqOYO4AJcgItRcge3XFBvXBC4ABfgYtws
//wg4LqyTCmgrMOwAKQDHJeYfiYMldPmGs8gnAABgAw0RmINqzYJtPGMt8AlyAC3AxkbmILlxQb1xgVgJc
//gIvJzUo0wcJFPmGs8gkEmYACUAyZT5TySpfphM9iYTA7ARSAwsSzCack/JdMdIUCcxOgAlSMlUv0RAX1
//RAVmJkAFqBgjk+gIRZtEojkTv/7MXsg=
