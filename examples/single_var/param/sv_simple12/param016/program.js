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
      var x = new Float32Array(data.x_sab); x[0] = 0.0000;
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      var x = new Float32Array(data.x_sab); x[2] = 1.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 0.1250;id7_R_t3: 0.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt20FPwjAUB/C7n2JHTYhj69omGg8SQ7yoCR44EhM8kIh4gJPxu7uxyQq8diDbaLu/J/K6PukGP183
//XxguVsuv1TIMg9lUTEaTJbsJ+tf99Od2NpVbgTCcL6bvH+mhj4PgLvi+nE3jyXiyjHrpXLZ+ddUL0miS
//vY6zKF+/yqN59iyap82jUXrE/G32mcVjJYcaZ5p4omRX41wTF5rfW7yfn+D++SF4evFxbTvvPSZXRK9T
//kBnUvJzMy8m8nMzLybzlWVXzllE1rySPlbvH5td4NBiuL/JWtr+zls7sZ7N1g5FpMDYNMtNgYhrkpkFh
//GpTFoDStU5rWKU3rlPQ6i9M8LL5K5DujZ+czX8fFzGO+vhchMANmwKwdzBr2ijhdzGbKRMUlOwQ4QAbI
//AJlVVdm+VZvlJfohrh+SbiDGgBgQA2I1IbaZ19dXN5F+KK6uiWrzSThD1zEXDnABLsBlY/UlWrRNureB
//BGyADbB1YFu5+Qgk+iGuH3KENvWDXi9iUcyBGBDDtrKhbeWJPgln6KIvXHNwofoCXKi+zrqt7EbtBdgA
//G2Dzelt51H39Q9Rz8GklaANtoM2TZ5i+3yervnDgDJyBMxcrNd6ieN482QR3TZJQrqgrCJYrUrOXUU5G
//hemcraOMzMvIvIzMy8i8/4PYiCtanvZrV6mvXaW+dpWU5Ee3OsXq36bKRqf9ryxYA2tgDc1PFqBW1fRE
//UwfSQBpIc6pSa6ENyirOGDgDZ+CsMc58bYg6C2L/uF0KwkAYCLO8Ijtva5S120sQB+JAXCc3nbX/84dV
//yNFPPE/lrJONUeAMnHWmXcqiTWczhKEiA2EgrAuNUw5sOkEciANx3m46W2ihsvZJJ5ADckDO2+efvt5P
//O72rALABNsDmRvV23rYqx56K1gXfL1a1tYY=
