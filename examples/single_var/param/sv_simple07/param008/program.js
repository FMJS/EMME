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
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[0] = 0.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); id4_R_t3 = x[0]; report.push("id4_R_t3: "+id4_R_t3.toFixed(4));
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
outputs[0] = "id4_R_t3: 0.0000";
outputs[1] = "id4_R_t3: 1.0000";
outputs[2] = "id4_R_t3: 0.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrT188vLSkoLdHXV8hMMYkPii8xtlIw0DMAAn393PyU1BygjIeTgq1CtUZmimF8eHxuYmaeDlCxEZBd
//Yqipo4AmbgwSN8IUhxiuWavg6Oei4OtPPRPB4hC96KohKtDNRohC1ULcFOTkBnYUigqYfUCdBiDduCQN
//8Uka4ZOEBUmQGzRIsKiCqAgOxxJosGDl0scWk4Y0jEm0cB+I+MWwneT4hbsJM3bhUoa4pYxwS+GJV6ga
//tFjFDErscWqgZ0rbOIWooX2cIuxBNgXDduw5GU+cwu3GjFO4lCFuKSPcUnjiFCWpweMUMygBijmUig==
