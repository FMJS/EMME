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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 3";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 259";
outputs[7] = "id6_R_t2: 2;id7_R_t2: 259";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoVNdrIpKh4sUryoUA89BiEeAtZ6SE/S/27SfJC2E002mw/hvZXZ2SbdlIfh
//JVJud/HXLpZSRKEfrIJY3QjnNgrnxWcpN9vw/SNpeFyIO/F9GYUqWAexO0t20OHT1UwcVT22qitVYnuJ
//7fXYanavaTW706zqJh2bt+gzratKd7VONXWvpq5r6n7NdfP72Yv75wfx9IIza35mJ7/eZ6vVXmJ7ie31
//2F6P7dVsrz7tzZ7xarE8POSjEy5+XbLTSXfXLbr54pxbVL8tUnH5Zf4XY7+f353tfF2nO/cXkkNAAQEg
//AARsIeCeIVAes9M/AcxVjWHAdAAYAEOP00F5nO6QMFBnGDAxAAbA0A2Gs6FgKBYU+8DJ6rRAQAEoAIVx
//sgQ6WywPXHVIEk7q+Xe2nBYAA2AADKPkCzZYaJwuGGOBKQJYAIvRMwe7WFBPWGCyABbAYuQcwowKoxTC
//ylShtA8qQAWomMqbDuXBkr10QhvNEKABNICGybz/0B4G03xCY5IAF+Dif78V0YUL6okLTBfgAlxM8F2J
//JljYyChMJ4trUAEqQMWAGUUltbSZUHgsF6YTBFgAC2BhuHzCKgp/pRNdqcAEASpAxVjZRE9UUC9UYKoA
//FaBinFyiIxRtUonmTPwAs3dfAA==
