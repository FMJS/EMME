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
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[1] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmekbthS4aSuimLaSLLCVgF0LTdGFWJe9ejReMHlujo9H038mZM15G+ZCf
//kXKzDb62gZTC92x34QbmrZje+Z6THku53njvH2HD00zci+9L3zPdpRsYk3AG7Y+uJuKgqtiqlasS20ts
//r2Kr8b1G1fhO46oRdqxX/mdUN3Pd+TpV1FVF3aqo2xXXTe5nJx5eHsXzK9as/poVnt5mq/leYnuJ7VVs
//r2J7LbbXKvbG73gxm+9f8sEKp08XzpxGs6sGjWTQ4QbN3wYpvfw8+cTY8/Oz45lvy2jm7kICASAABDpF
//wCghkC3ztHsCmKsCBsAAGIb4d5Atp9EnDAQYAANgODEMpZ+Cvlgw2ReuFwUDKAAFoHCaLIFKg9mCmy2S
//hEI9OSdgAAyAYQz5gg4WaqcLwAJYAIvxZg56sSBgASyAxXnmEM2oaJRCaIHCsa9BBagAFUPZ6ZAtLOlL
//JyzQABpAw7j3PxwPQ9N8AlyAC3Ax8l0RbbggcAEuwMX/2StRBwsdGUVTKm5ABagAFT1mFLnUUmdCoVgu
//wAJYAAvDzye0ovBXOgEqQAWoGGs20REVBCpABag4o1yiJRTHpBL1mfgBl35fIA==
