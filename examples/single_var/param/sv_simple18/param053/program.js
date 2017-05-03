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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 769;id7_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQTG8TimF7poKKGbtpAuspSCXQhN04VZlbx7NV4wemyNjlHh38mZM15G+ZCf
//kXK7C793oZQi8F1v5YX2rbDuAn+eHUu52fofn1HD00Lci5/LwLe9tReqWTSDDkdXM3FUddiqLlSJ7SW2
//12Gryb3G1eROk6qKOjbvwVdctwvdxTrV1J2auq6puzXXTe9nLx5eHsXzK9as+ZqVnt5lq8VeYnuJ7XXY
//Xoft1WyvLvcm73i1WB5e8tEKZ08XzbTi2XWDKh2cc4P2X4OUXX6ZfmLs+fnZycy3dTxzfyE5BBQQAAJA
//wBQCqoJAvsxW/wQwV20Nw9y9Bg2gATT093+QL6c6Jw1kgIYb0AAaQEMnGio/BueCwWZfeHcWkCcABaAw
//gjyBKoP5gtsd0oRSPT0nMgbAABimkDGYYKFxwtAaC+QO4AJcjCB3MMsF9cYFsghwAS4GziLaYdEqiWhN
//BfIJQAEoRrnfIV9YMpdPaOQTgAEwTHkPxOkstM0nNPIJcAEupr0vogsX1BsXyCfABbgY3V6JJliYyCc0
//8glAAShGn08U8kqT6YTDYoFsAigAhbFnE0ZJ+C+Z6AoFcglQASqGyiV6ooJ6ogKZBKgAFUNkEh2hOCWR
//aM7EL+xFXyA=
