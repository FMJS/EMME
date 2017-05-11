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
      var x = new Int8Array(data.x_sab); x[1] = 3;
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
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 771;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 771;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2jFrg0AUB/C9n+LGFgKX83laWjo0lNClLaRDRimYQWiaDmYq+e7VaESTZ2vuzujw38K7d1HP8CP8
//eVJutun3NpVSJHEQLaLUuxPT+yQOD5+lXG/i1WfW8DwTD+LnOom9aBmlapLtoP2nm4loVH22qmtVYnuJ
//7fXZanGvebW406Kqso71R/KV171ad71OLXW/pa5b6kHLdcv72YnH1yfx8oYz635mR08fsNV6L7G9xPb6
//bK/P9mq2Vx/3Fu94MZvvX3LjhA9Pl+2c5rvbFlW5GHKL3l+LdLj8vPyJsd/P7y52vi/znbsrySFAQAAI
//AAFXCKgTBKpjnvZPAHNVYxjC4BY0gAbQ0N//g+o41SVpIHsaQgUaQANosKLh5I/BpWDw2Bduz0I9T1BA
//ASgAhWHyBDpZrA7cs0gTjurld56ZMQAGwAAYBskYXLDQOWEwxqKZO4ALcAEuBskd3HJBfXHRyCLABbgA
//FwNkEWZYGCURxlRg3gFQAIpRzjtUB0vu8gltlE8ABsAAGEYyA3E+C6b5hDbMJ8AFuAAXI5mLsOGC+uIC
//sxLgAlyMb1aiCxYu8gltlE8gyAQUgOKS+UQtr3SZTvgsFhqzE0ABKIw8m3BKwn/JhC0UmJsAFaBiqFyi
//JyqoHyowMwEqQMUgmYQlFOckEt2Z+AXCzl8U
