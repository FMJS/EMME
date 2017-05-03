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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[1] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZoMw+FiNC5sTONGTeqiS2KCCxJrXdCV6bsL5RIKB6UwUKj/jpw5w2UgX8if
//kXKzDb+2oZQi8B1v6YXmjTBuA9/NjqVcb/z3j6jhcS7uxPdl4JveygvVLJpB+6OrmTioWmzVLlSJ7SW2
//12Kryb3G1eROk6qKOtZvwWdcNwvdxTrV1K2aul1Td2qum97PTtw/P4inF6xZ8zUrPb3DVou9xPYS22ux
//vRbba7O9drk3ecfL+WL/kg9WOHu6aKYRz64bVOmgyw2avw1SdvlF+omx5+dnJzNfV/HM3YUEAkAACPSK
//gKogkC+z0T8BzFUBA2AADGP8O8iXUw0JAwEGwAAYTgxD5adgKBZM9oXrRYGAAlAACqfJEqgymC+42SFJ
//KNXTcwIGwAAYppAv6GChcboALIAFsJhu5qAXCwIWwAJYnGcO0Y6KVimEFihc5xpUgApQMZadDvnCkr50
//wgYNoAE0THv/w/EwtM0nwAW4ABcT3xXRhQsCF+ACXPyfvRJNsNCRUbSkwlWgAlSAigEzikJqqTOhsFgu
//wAJYAAvjzye0ovBXOgEqQAWomGo20RMVBCpABag4o1yiIxTHpBLNmfgB1JhfDA==
