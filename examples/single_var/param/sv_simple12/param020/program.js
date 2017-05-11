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
      var x = new Float32Array(data.x_sab); x[0] = 2.0000;
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      var x = new Float32Array(data.x_sab); x[2] = 1.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 2.0000;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.1250;id7_R_t3: 0.0000";
outputs[3] = "id6_R_t3: 0.0000;id7_R_t3: 2.0000";
outputs[4] = "id6_R_t3: 2.0000;id7_R_t3: 2.0000";
outputs[5] = "id6_R_t3: 0.1250;id7_R_t3: 2.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2z1PwzAQBuCdX5ERJEQaO7YlEAMVqlgACQbGCqkMlSgwlAnx38kXjWnPTkubxHZepuqcHHXSPj3H
//ujh+/1x+fC7jOJrP5PRhuuTn0ehslP1dzGfqTyCOF++zl9fs0JtxdBl9Hc9nbPo0XSan2bm8eHVyGmXR
//NH/N8qgoXpXRMnseLdOW0SQ7YvE8f8vjTMuhx7khnmrZ9bgwxKXh/1bv5zu6uruObu9DnNvae2fkjOh5
//SjKDnleQeQWZV5B5BZm3vqp63jqq51XksWr92PIeP4wnxU3+k+33qmVnjvKzTYOJbZDZBrltMLUNCtug
//tA2qalDZ5qls81S2eSp6ntVlnlRfJfKd0WeXZz4+VWfu8vU9ioEZMANm3WDWslfE5eIuUyYbbtk2wNkh
//Y4AMkAGybquyTatW00vNQ8I8pPxAjAMxIAbEDoTY6ryRubpJzEOsuSY6mE/SG7p2uXGAC3ABLherL9mh
//bcq/BWT7sOH5GGADbL0vK1cfgdQ8JMxDntCmf9APi1jCBBADYlhWtrSs3NMn6Q1d9I1rDy5UX4AL1Vev
//y8ph1F6ADbABtqCXlTs9199GPQ93K0EbaANtgexhhv6crPnGgTNwBs58rNREh+IFs7PZA3dsENwV8XpG
//Q0GwnpGevY4KMipt16yIcjIvJ/NyMi8n8/4PYiuuaHnarF2VuXZV5tpVUZLv3OrE9N+mxkanza8sWANr
//YA3NTw6g1tT0RFO3LWkMpIE0kDaQNiinOOPgDJyBs9Y4C7UhqhfE/vG4FISBMBDmeEXWb2uUs8vLdonD
//czQQB+KG0iTlFHL0jue+nK01RoEzcIZFZ1DtUg4tOtshDBUZCANhQ2ic8mDRCeJAHIgLdtHZQQuVszud
//QA7IAblg9z9DfZ62f1cBYANsgM2P6q3ftirPdkUPBd8P5FS1qA==
