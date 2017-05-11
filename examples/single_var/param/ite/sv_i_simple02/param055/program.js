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
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 >= 1) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
      }
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[2] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmEtrg0AUhff9FbNMIDCZl1NaskhopYs+IGnIUkrtQmhiF2ZV+t+rjqYTueLETImLuxuO5+r1znwc
//kdJ0n33tM0pJEgfRMsr4DZneJvF1vaZ0m8Yfn7nhYUFm5HuUxDzaRBmb5BWiXI0n5EiVoKosVYBeAXol
//qJpeC9V0alSWO7Zvya7QueW2ddGiyxZdtehBy3Orfn7I/PmOPL3gzNxn1nj7AFRtrwC9AvRK0CtBrwK9
//quk1e7xchOUmH024fru8clpUj+qixkVW3ySsDgp4C7jaVK42RaVZl2N9T3fxLJw/ru7HVxT5Rr6Rb/98
//HybTl257tP/ENkO2kW1k2292H8bZI7mrWmQb2Ua2B5fbLmTDqe2Ra/weR66Ra8+Zrc7IbIVsI9vI9kAz
//W/XO7DO5ZjnXeuBcX+o0/o1et5xRPViuLzUz3kFf0EkfzJnzXjS60GAXGuxCg13oTq55k2sNx3kr2fYG
//6dP+ob0u1y5oM0Qb0Ua0faJtXToRbN4d2Y5YY2Ij1oi1V6xlb6ylI9a/oyYvPg==
