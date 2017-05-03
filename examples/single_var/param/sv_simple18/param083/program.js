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
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 256;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 513";
outputs[7] = "id6_R_t2: 256;id7_R_t2: 513";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcJ05mRSUFxYpLhRoS66DEK6CFjrIl1J392kSUOanmg6maQX/105cyaXSfnI
///ETK5Sr+WsVSiij0g2kQ61sxvIvC0fa3lItlOP9IGp7G4l58X0ehDmZBrAbJDNr8uhmInarHVk2pSmwv
//sb0eW82uNa1mV5pVVdKxeI8+07oudZfrVFP3auqmpu7XnDe/nrV4eHkUz69Ys+ZrVrl7n62We4ntJbbX
//Y3s9ttewvabamz3j6Xiyecg7K7y9u2TmMJ1dN6jywRE3qH8bpO3pJ/lfjD0+Pzub+TZLZ66vJBAAAkCg
//UwTUHgLFMg+7J4A5qzUM2vigATSAhu7eD4rlVH3SQKABNICGo9Ow92LQFwyafeDtWShvJRRQAApA4Th5
//Au0NFguuW6QJlXp+TMAAGADDOWQMLlhonDBYY7G7uQAX4AJcHCV3cMsFgQtwAS4uNYuww8IqiXCyDTFK
//gwpQASpO5YuHYmHJXUJhQANoAA3n/R3E4TDYZhTGctMBMAAGwDiZryPagEEAA2AAjP/0zUQTLlzkFLab
//EQIVoAJU9JhTlJJLlymFx3IBFsACWDj9jMIpCn8lFG2pqG43gAWwABb95RMdYUHAAlgAi4vKJlpScUgy
//0RyKH46JYiA=
