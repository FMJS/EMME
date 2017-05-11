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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[5] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[6] = "id6_R_t3: 131072;id7_R_t3: 2";
outputs[7] = "id6_R_t3: 131584;id7_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt201PwjAYwPG7n2JHTUjG2gJG40FiiBc1wQNHYoIHEhUP42T87g42oIOOt63di/8bedo+2yj88iTd
//4/uzefg9D33fm0664+E4lDde+3Y66a0++/7nbPL+EU147Ht33s/ldCLGo3EYtKIVcvnpquWlokqLSmM0
//vtIiGl8njgbRjM+36dciLrTZelxmxFVGvLOIi914N+O6yf38evfPD97Ty/954q0n0rNsol3jXD2DNGaQ
//xgzSmEEZMyhjBmXMEK/bnruJpvZ42B8sNzm1R6vvJ1rZXqzOGgz2DYp9gzIZ7O1b2TOvTG58kPw4jfnN
//q+OVr6Nk5Sl/iAsfKqACKvZQkV+DzeB6i9v2oTBc9WQ+YAImYCJ/RXEiE+utDFwyIWECJmDCLhN5C4ay
//kRDGH6EtOjqBAA/wAI/iawxVCh8KKIACKOpTZagKVRm28Ahk0O7hB37gR+7jkV1c1g8kXAqif41YgRVY
//Ucr5yEm1RjlSmGsN/MAP/Ci91jjibKRsPyR+4Ad+lOZHvkOTalYfzk3pXCtMwRRMOasmUVVTReEHfuBH
//PWoSVY+axK0p+ktjAk7ghHLEbbfK7qCG0fm9KlvxJOfhDhaYgAmYqFqnShFIHN2ncpgOkAAJkKhan0qx
//SEiQAAmQaFaXir06wj4c6VfPoQM6qC+c9qgUi4eCCZiAiaZ1qLioMGzRsfPOF3qgB0WG0/6UYv04cGqK
//FEiBFLXsTnFRZ6AHeqBHE3tT7B2VoAd6oEeTO1Ncn6E4ESX9XjmiIAr1iMO+FHtHK+iBHujR5K4U1ycu
//RYryB1HyqHw=
