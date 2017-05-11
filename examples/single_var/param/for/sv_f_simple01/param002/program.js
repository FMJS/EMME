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
      for(i = 0; i <= 1; i++){
         var x = new Float32Array(data.x_sab); x[i] = i+0.1;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2.toFixed(4));
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
outputs[0] = "id3_R_t2: 0.0000";
outputs[1] = "id3_R_t2: 0.0141";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlc0KgkAQgO89xR4TpN3RVAg6JCFdKrBDxyWwg5DZQU/Ru7dpxlbrYEa/rCedb8Yddz9GStM82+UZ
//pSSObB7yzBoQ1mPiojRJo/VGkIlPhmTfjSOLL3kGnJnkcg+GSQQB8ZSs4q1EWC1R1JRLGwcymo3JdP6u
//9Yq4vIoiDnf9hX5QNNit4qeM6u2ituikDgIGLQzaGOxj0MGgi0Gv+uTgfCSKrDJjsTxnqI61Q7VnP+PZ
//y1S6hdKG2g08KzZLUS37p037m4nm1vkCSkcl6GDQa20aNDQN+qBNe8g0qQuGTQnAoIXPl5fI5LY07Xrb
//W5umZ9r3zTT3Axp6T/w9Gxl4BK3ufmQ=
