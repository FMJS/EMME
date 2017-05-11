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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 < id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 2";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[7] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm0tvgkAUhff9FSw1MUG5MiZtXGha00UfibZxSZrSBUnVLnDV9L+Xl3XUIQHm0RHPbnKRO3CZL2fu
//EVx3s42/trHrOlE4DOZB7F07/Zso9LnxaDd23dUm/PhMfnw/dcbOdycKvWAZxINecjZlo27P6ewypdE8
//z3F0xEV9YXSQZFu9Res07nGZ+TiVxIclefySeDHvjzN5unUen9t3Z1l8fz9DYdQXRvkMJMxAwgx0nCGv
//7nw6y8p7ULPdFSdn9tOzD0onODgSHyxmmBXPT5i/LLU4a55xsUwz5uOsvu+bdTieTR4Wd90rVwSQB4AA
//kEGA/qqgBR++xgbggfoAHpPwkFZ4yCw8vPJ4gAfw/J/ynBxSozt8FKoDcNrY85AsOmUdD+mBB/0O4LFE
//dUiP6hBUB+C0uteRBodsAMcDOADHKoua0yplBnWRU/V2DfAAHpvs6Sro1DOnJcGB6gCcc7Cmq4BDJsEp
//s6UBDsCxx5ZurjdiUxpqA2guwJKW6XBIBzjobwCO/XZ0c7UhqA2guUwrunlnYxQa/H8DaOyyoUmDDU16
//tmmAB/DYZEOTchuaoDoAp/02NCm3oUmPDQ1wAI49NjQptqGhNoDmAmxoUm5Do78BOK23oUmxDQ21ATSt
//t6FJsQ2tEJpUdZgiaHQvl/2sTLh0WUkOJg2N7jurs+DrLG3Jih1dBRPOx+S2aCcyxBR9vMY/J1bvU4KX
//+SvYATs2sEM1PAGm5BMcs9x44AbcWKQ5Mm+nicmp8M4AuAE3Z603zd+zMckM9mhgxiatIeVaQ+AG3LRc
//a0ix1lRl5hdW/ncV
