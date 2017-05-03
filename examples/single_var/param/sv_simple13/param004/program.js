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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[1]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[1] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[5] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[6] = "id6_R_t3: 65536;id7_R_t3: 1";
outputs[7] = "id6_R_t3: 65792;id7_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm09PwjAYh+9+ih01IRlb6YgaDxJDvKgJHjgSk3kgEfEAJ8N3d2NjK1D+TNpukOe2vG1f2Lrfwy+8
//fX1/Op/9zGe+743jaDQYzcSd174fx93Vte9PpvHnVzLhuec9eL/X4zgcDUezoJWsEMurm5aXRDvpdZhG
//5fIqi2Y502iWMYsGyYzJx/g7jYdKDjUudsQ7SnY1LnfEox2fm3+fhff4+uS9vF3ivS3j5R2p2cuo1EYj
//bQY1r9DmFdq8QptXaPOWzzrSRtW5UjtXbs7N9njQ6y83eW3nVk8tWdlOV+8aDPYNhvsGRT7Y3beyq1+Z
//f/F+/nJq8+tXZyvfh+nKxZWPzJE5Mjek5HKw2Pi2fZFrPhXpI32kb+gXvqL0iw0OXEpfIH2kj/SrS//U
//H/a6ha++bCZxEMoIIAAEvMAptCgeiVMkqBuB+BE/4q/BDdQjfb0bOB0IkZQCJIAE/ECF/wy3eVHcfOgS
//ChL5I3/kb6EqUMkR1CN+vSMACSABJNhwBEcUBOpGggAJIAEkmETCaYWCZnoEe5jo3oZgAkzgHKqWD+oG
//RUf7aoIEkAASXDiHxgHhcL3BJCbUI0oBiAARuAZb/Qfbgwpg/t99sBHPcyJ9pI/0m9GTYEL4R3ckgANw
//AA6a3KdgFgcCHIADcHCuvQv2vIF9RKwfaQYSQALPYKmfwSwmDhxeBggAASA0ucfBhWuwBYnNI01gAkzg
//Gyz1PZgFhQQJIAEknHMvhAvnACbABJg46/4IezUKMAEmwMRF9Ey4rl24QMf6oWnQATpwGFb6KOxVNMAE
//mAATF9Fb4brOYRIdf3RNq98=
