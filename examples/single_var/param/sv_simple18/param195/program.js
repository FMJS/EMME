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
outputs[1] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 515";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQRG5zgGWrpoKKGbtpAuspSCWQhN04VZlbx7NV4wemyNGY2m/07OnPEyyof8
//jJSbbfi1DaUUge96Cy9Ut8K6C/xpdizleuOvPqKGp5m4F9/Xga+8pRfak2gG7Y9uJuKg6rBVXagS20ts
//r8NWk3uNq8mdJlU76li/B59xXRW6i3WqqTs1dV1Td2uum97PTjy8PIrnV6xZ8zUrPb3LVou9xPYS2+uw
//vQ7bq9leXe5N3vFiNt+/5IMVzp4ummnFs+sG7XRwyg2q3wYpu/w8/cTY8/Ozk5lvy3jm7koCASAABDpF
//wK4gkC+z1T0BzFUBA2AADEP8O8iX0+4TBgIMgAEwnBmGyk9BXywo9oWbRYGAAlAACufJEqgymC+4OiFJ
//KNXTcwIGwAAYxpAvmGChcboALIAFsBhv5mAWCwIWwAJYXGYO0Y6KVimEESi0rUAFqAAVQ9npkC8smUsn
//NGgADaBh3PsfjoehbT4BLsAFuBj5rohTuCBwAS7Axf/ZK9EECxMZRVsqNKgAFaCix4yikFqaTCgclguw
//ABbAwvDzCaMo/JVOgApQASrGmk10RAWBClABKi4olzgRimNSieZM/AC7QF7I
