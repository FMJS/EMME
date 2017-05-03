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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2);
      if(id3_R_t2 >= 1) {
         var x = new Int8Array(data.x_sab); x[0] = 2;
      } else {
         var x = new Int8Array(data.x_sab); x[1] = 2;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
outputs[0] = "id3_R_t2: 0;id6_R_t3: 0";
outputs[1] = "id3_R_t2: 0;id6_R_t3: 1";
outputs[2] = "id3_R_t2: 0;id6_R_t3: 512";
outputs[3] = "id3_R_t2: 0;id6_R_t3: 513";
outputs[4] = "id3_R_t2: 1;id6_R_t3: 0";
outputs[5] = "id3_R_t2: 1;id6_R_t3: 1";
outputs[6] = "id3_R_t2: 1;id6_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtls2ugjAQhfc+RZeSmJQBdHGNC40SF/4keG9cEiMuSFRc4Mr47rZUoFK8BW1iMN1NDj3T6fRLGYyj
//c3w6xxijMLB9z4+tH2T2w6BHY5vEGB+iYLcnC6YjNECXdrquQxxdf00io4OICiQ+bMIj1S2qg6gzp6g/
//y8OqMK5ouBij+fJT+yc6y1nMkqt8jlzlM+R18yrzCaf1Rm5y3AdfWhtxmtTdTk11PkK6gyv0k1tV7mbO
//1Zo6WZx0bBsdg4E7nK0mRgvLkAKNVAORAuFj1hHzDaAK+j2nCsy6YGnQvuLtyqoDdaDdc6oBzdagNQU0
//7tFSiRnfS2WQgWQOe+cyy1vuPLlihz9Ihpiq/WXQyPGofIJCZl51aiD2D0UKprBymCrNYL/eXxWaQNPU
//OJpeG8AkLNUfvyoSZmnCvoCwbD9lhDnyX2JC2A37Pd+h
