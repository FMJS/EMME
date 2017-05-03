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
      if(id3_R_t2 < 0) {
         var x = new Int8Array(data.x_sab); x[0] = 0;
      } else {
         var x = new Int8Array(data.x_sab); x[1] = 0;
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
outputs[1] = "id3_R_t2: 1;id6_R_t3: 0";
outputs[2] = "id3_R_t2: 0;id6_R_t3: 1";
outputs[3] = "id3_R_t2: 1;id6_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtljsPgjAUhXd/RUdITEo1OmgcIEocfCQwMBIjDiQCDjgZ/7st5VEpPoAaxXS7Oe25feTLyYUwOsen
//cwwh8L2ha7nxYAK0qe+NST3ENYRB5B2OeMPSADNwUbJ9fewYuQ6u1D7AKsJ1sPNDog+IjnidOnn9UR96
//C/UK9M0crLffOj/Rac9yl0JlexQq26G4N6tSH/dayzCT5975srthp0bcSmaqs4iyE0zuP5ld1W7qtB3i
//pHXyY/so9GamvrIXag9WIYUkUj+KVP6ujwDF/ppAnNiEQhKnDiYU4hYZEJvnU0lPe4pILYlZ91KrGWQv
//MkssYnLW+r9ZK78dEpdkaU85f8n5633I6iVZS8TkTNbJJHvCX5scq0ZPYIpJxDqSYi0BqwapJV43cYeQ
//VA==
