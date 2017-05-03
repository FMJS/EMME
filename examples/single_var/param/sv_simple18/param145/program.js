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
      var x = new Int8Array(data.x_sab); x[1] = 1;
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
outputs[1] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 256;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQRG5zgGWrpoKKGbtpAuspSCWQhN04VZlbx7NV4wemyNjtGk/y6cOeNlDB/6
//q5Sbbfi1DaUUge96Cy9Ut8K6C/xp9lvK9cZffUQNTzNxL76vA195Sy+0J9EM2v+6mYiDqsNWdaFKbC+x
//vQ5bTY41riZHmlTtqGP9HnzGdVXoLtappu7U1HVN3a3Zb3o8O/Hw8iieX7FmzdesdPYuWy32EttLbK/D
//9jpsr2Z7dbk3ucaL2Xx/kQ9WODu7aKYVz64btNPBKTeofhukbPfz9C/Gbp+fncx8W8Yzd1cSCAABINAr
//AnYFgXyZrf4JYPbaGgalXdAAGkBDf/cH+XLap6SBQANoAA2D01C5MTgVDIq94N1ZKD5KKKAAFIDCMHkC
//VQbzBVcd0oRSPd0mYAAMgOEcMgYTLDROGFpjcfhwAS7ABbgYJHcwywWBC3ABLi41i2iHRaskwshjCEJL
//QAEoRvO9Q76wZC6f0IABMACGc/4G4ngW2uYTuuUDB7gAF+BiJN9FdOGCwAW4ABf/51uJJliYyCc0XpMC
//CkAx+nyikFeaTCccFgugABSAwtizCaMk/JVMdIUCL0JBBagYKpfoiQoCFaACVFxQJtERimMSieZM/ADP
//BF7o
