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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 515;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 515";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 515";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 515";
outputs[15] = "id6_R_t2: 515;id7_R_t2: 515";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmznEMtHTRUEI3bSFdZCkFuxCapguzKnn3ajQy0WNrxvGy+Hdy5oyXUT7k
//Z6Tc7ZPvfSKliKMgXIeJuhXzuzhanI6l3O6ij8+04Wkp7sXPdRypcBMm3iydQcejm5k4q/psVRtVYnuJ
//7fXZan6vWTW/07zqpR3b9/grqyuj26xTQ91vqOuGetBw3eJ+DuLh5VE8v2LN2q9Z5ekDtmr2EttLbK/P
//9vpsr2Z7dbU3f8fr5er4ks9W+PR06cx5Nrtp0CsGF9yg+muQTpdfFZ8Ye35+dj7zbZPNPFxJDgECAkAA
//CLhCwKshUC7zvH8CmKtaw6A9BRpAA2jo7/+gXE5vSBrIAQ0aNIAG0NCJhtqPwVAwKPaFd2fBzBMIKAAF
//oDBOnkC1wXLBVYc0oVIvznlhxgAYAANgGCVjcMFC64TBGovz3AFcgAtwMUru4JYL6o0LDS7ABbgYN4uw
//w8IqibCmwswn0r8MUAEqQMVUdjyUC0vuEgptlVCABtAAGiazD+JyGGwzCm2ZUQAMgAEwJrM7ogsY1BsY
//GmAADIAxvT0TbbhwkVNoy5xCgwpQASoGzCmM5NJlSuGzXNhmFGABLICF4TIKpyj8l1B0paKaTwALYAEs
//hssnesKCesJCAwtgASxGySY6UnFJMtEeil99yWIg
