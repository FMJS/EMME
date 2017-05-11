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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 771;id7_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmehwtLV00lNBNW0gXWUrBLISm6cKsSt69Gi8YPbbGGaPCv5MzZ7yM8iE/
//I+VuH33vIylFGLj+yo/sOzG/DwMvP5Zyuws2n3HD80I8iJ/rMLD9tR9Zs3gGHY9uZuKk6rBVVaoS20ts
//r8NW03tNqumdplUr7th+hF9J3S51l+vUUHca6qqh7jZcN7ufg3h8fRIvb1iz9mtWeXqXrZZ7ie0lttdh
//ex22V7G9qtqbvuPVYnl8yScrnD9dPHOezG4atLJBjxu0/xqk/PLL7BNjz8/PTme+r5OZhyvJIUBAAAgA
//AVMIWDUEimWe908Ac9XOMHjuLWgADaChv/+DYjmtS9JA+jR4FmgADaBBi4baj8GlYLDZF67PAvIEoAAU
//RpAnUG2wWHBbI02o1LNzImMADIBhChmDCRZaJwydsUDuAC7AxQhyB7NcUF9cIIsAF+Bi6CyiGxadkojO
//VCCfABSAYpT7HYqFJXP5hEI+ARgAw5T3QJzPQtd8QiGfABfgYtr7InS4oL64QD4BLsDF+PZKtMHCRD6h
//kE8ACkAx+nyilFeaTCccFgtkE0ABKIw9mzBKwn/JhC4UyCVABagYKpfoiQrqhwpkEqACVAySSWhCcU4i
//0Z6JX+vnXww=
