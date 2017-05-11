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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 259;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 259;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoVtdrIpVTxYpHhRoR56DEI8BKz1kJ6k/92k+SBNJ5puNt0c3luZnW2STXko
//LyPldpd87xIpRRwF4SpM1K2Y3sXRrPws5WYbfXymDU8LcS9+ruNIhesw8SbpDjp8upmIo6rPVnWtSmwv
//sb0+W83vNavmd5pXvbRj8x5/ZXVV667XqaXut9R1Sz1ouW5xP3vx8PIonl9xZt3PrPH0AVut9xLbS2yv
//z/b6bK9me3WzN3/Hq8Xy8JKPTrh8unTnNNvdtugVizNuUf21SOXll8VPjP1+fne+822d7dxfSQ4BAgJA
//AAjYQsA7QaA65unwBDBXNYZB6QA0gAbQMNz/g+o4vUvSQBZomIMG0AAaetFw8sfgUjAo9oX3Z6GeJ3hA
//ASgABTd5Ap0sVgeueqQJjXrxnWdmDIABMAAGJxmDDRY6JwzGWBznDuACXIALJ7mDXS5oMC7m4AJcgAu3
//WYQZFkZJhDEVmHcAFIBilPMO1cGSvXxCG+UTgAEwAIaRzECcz4JpPqEN8wlwAS7AxUjmIvpwQYNxgVkJ
//cAEuRjcr0QULG/mENsonEGQCCkBxyXyillfaTCd8FguN2QmgABRGnk1YJeG/ZKIvFJibABWgwlUuMRAV
//NBAVmJkAFaDCRSbRE4pzEonuTPwCEsle+A==
