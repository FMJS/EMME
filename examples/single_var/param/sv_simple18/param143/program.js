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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 3;id7_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[7] = "id6_R_t2: 3;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoVtdnZbUDxYpHhRoR56DEJ6CFjrIT1J/7tJ80GaTjTdbD6E91ZmZ5t0Ux6G
//l0i520df+0hKEQYzf+VH6lZM78Jgnn+WcrsLNh9xw9NC3Ivv6zBQ/tqPvEm8g46fbibipKrZqilVie0l
//tlez1fRek2p6p2nVizu27+FnUlel7nKdauq6pm5q6rOa62b3cxAPL4/i+RVn1vzMKr9+xlbLvcT2Etur
//2V7N9hq211R702e8WiyPD/nkhPNfF++cJrvrFr1scc4tqt8WKb/8MvuLsd/P7053vq2TnYcrySFAQAAI
//AAFXCHhnCBTHPO2eAOaq1jBgOgAMgKHD6aA4Tq9PGKg1DJgYAANgaAfD2VDQFwuKfeDkdFpQQAEoAIVh
//sgQ6WywOXLVIEir17DsvnBYAA2AADIPkCy5YaJwuWGOBKQJYAIvBMwe3WFBHWGCyABbAYuAcwo4KqxTC
//yVRhPFABKkDFaN50KA6W3KUTxmqGAA2gATSM5v2Hy2GwzScMJglwAS7+91sRbbigjrjAdAEuwMUI35Vo
//goWLjMJ2stCgAlSAih4zilJq6TKh0CwXthMEWAALYKG/fMIpCn+lE22pwAQBKkDFUNlER1RQJ1RgqgAV
//oGKYXKIlFJekEs2Z+AH/Pl7Y
