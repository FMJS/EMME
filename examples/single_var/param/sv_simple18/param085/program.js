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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoXt7mQTUDxYpHhRoR56DEI8BKz1kJ6k/92kSUPaTDTdbD4O763MzjbJpjyU
//l5Fyu0u+d4mUIo78cBUm+lbM7+IoOH6WcrONPj7ThqeFuBc/13Gkw3WYqFm6gw6fbmbipOqxVVOpEttL
//bK/HVvN7zar5neZVlXZs3uOvrK4r3dU6NdS9hrppqPsN1y3uZy8eXh7F8yvOrP2ZnT29z1arvcT2Etvr
//sb0e22vYXnPem7/j1WJ5eMknJ3x8unTnPNvdtKiKxYBb1H8t0vHyy+Inxn4/vzvf+bbOdu6vJIeAAgJA
//AAi4QkDVECiPed4/AcxVrWHQxgcNoAE09Pf/oDxONSQN5ICGADSABtDQiYbaH4OhYNDsC+/OQjVPUEAB
//KACFcfIEqi2WB647pAln9eI7L8wYAANgAAyjZAwuWGidMFhjcZo7gAtwAS5GyR3cckG9cRGAC3ABLsbN
//IuywsEoirKnAvAOgABSTnHcoD5bc5RPGKp8ADIABMExkBuJyFmzzCWOZT4ALcAEuJjIX0YUL6o0LzEqA
//C3AxuVmJNli4yCeMVT6BIBNQAIoh84lKXukynfBYLAxmJ4ACUJh4NuGUhP+Sia5QYG4CVICKsXKJnqig
//nqjAzASoABVjZBIdobgkkWjPxC8BC17o
