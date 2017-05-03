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
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 771;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2jFrg0AUB/C9n+LGFgIX73laWjo0lNClLaRDRimYQWiaDmYq+e7VaESTZ2vuzujw38K7d1HP8CP8
//eVJutun3NpVSJHEQLaJU3YnpfRKHh89Srjfx6jNreJ6JB/FzncQqWkapN8l20P7TzUQ0qj5b1bUqsb3E
//9vpstbjXvFrcaVH1so71R/KV11Wtu16nlrrfUtct9aDluuX97MTj65N4ecOZdT+zo6cP2Gq9l9heYnt9
//ttdnezXbq497i3e8mM33L7lxwoeny3ZO891ti165GHKL6q9FOlx+Xv7E2O/ndxc735f5zt2V5BAgIAAE
//gIArBLwTBKpjnvZPAHNVYxjC4BY0gAbQ0N//g+o4vUvSQPY0hB5oAA2gwYqGkz8Gl4JBsS/cnoV6nqCA
//AlAACsPkCXSyWB24skgTjurld56ZMQAGwAAYBskYXLDQOWEwxqKZO4ALcAEuBskd3HJBfXHRyCLABbgA
//FwNkEWZYGCURxlRg3gFQAIpRzjtUB0vu8gltlE8ABsAAGEYyA3E+C6b5hDbMJ8AFuAAXI5mLsOGC+uIC
//sxLgAlyMb1aiCxYu8gltlE8gyAQUgOKS+UQtr3SZTvgsFhqzE0ABKIw8m3BKwn/JhC0UmJsAFaBiqFyi
//JyqoHyowMwEqQMUgmYQlFOckEt2Z+AWZtV8c
