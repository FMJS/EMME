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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[1] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[3] = "id6_R_t2: 768;id7_R_t2: 3";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZoMcBgwGhc2pnGjJnXRJTHBBYm1LujK9N2FcgmXg1IYCq3/rjlzhsvQfIEf
//pNxsw69tKKUIfMdbeqF1I4zbwHez31KuN/77R9TwOBd34vsy8C1v5YXmLJpB+19XM1Gq2mxVFarE9hLb
//a7PV5FjjanKkSdWMOtZvwWdctwrdxTo11O2GumqoOw37TY9nJ+6fH8TTC9as/ZpVzt5hq8VeYnuJ7bXZ
//XpvtVWyvqvYm13g5X+wvcmmFs7OLZhrx7KZBMx10uUHrt0HKdr9I/2Ls9vnZyczXVTxzdyGBABAAAoMi
//YNYQyJfZGJ4AZq+dYXCda9AAGkDDcPcH+XKax6SBQANoAA2j01C7MTgWDBZ7wfuzUHyUIKAAFIDCOHkC
//1QbzBbd6pAmVerpNwAAYAMMpZAw6WGidMHTGovxwAS7ABbgYJXfQywWBC3ABLs41i+iGRackQstjCEJL
//QAEoJvO9Q76wpC+fUIABMACGU/4G4nAWuuYTquMDB7gAF+BiIt9F9OGCwAW4ABf/51uJNljoyCcUXpMC
//CkAx+XyikFfqTCdsFgugABSAwtSzCa0k/JVM9IUCL0JBBagYK5cYiAoCFaACVJxRJtETikMSifZM/ABo
//G18w
