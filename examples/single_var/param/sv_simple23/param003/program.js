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
      var x = new Float64Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1.toFixed(4));
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
      var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 0.0000;
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
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
outputs[0] = "id2_R_t1: 0.0000;id5_R_t2: 0.0000";
outputs[1] = "id2_R_t1: 0.0000;id5_R_t2: 2.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3M1vmzAYx/H7/gqOmxSNN2NLq3pYVVW7bJO6Q4/RpOwQqS87pKep/3vJIMQB26GtoYZ8e6qeB5xA
//yEeWf5A4fnjc/H3cxHG0XmXL6+Um/RIln5Py72y9KraFbFeI47uH1Z/bctNvF9F59O/jbo9FuW++vCn/
//+7SIDqpCq1ZbtKvVS2yrclvN2lWlVast2tW0/P/u9/p+0RxBt66/O70uLPXq9bt1aXnd+v08RV9/XEbf
//f3J2TGendfT6KPuqNG6rj7A/U/oI+6o0bquPIIwjCOMIoj1C9RlfX1z9/5AP3uXumMs9k+3etmbqamau
//Zu5qClezcDWlq6nq5v6qMxynsZm6mpmrmbuawtUsXE3paqrdR3vV+fpqW5n3rvb8dVPv2edLV196Tx9i
//CIZgCPZO8MAcGs5XYm+l9lZmb+XQe0iv+SJ9GcjAC7zAO7O5b5fs5qCFvVXYW8x6rfQq6IVe6A2G3uHn
//n95UlYDrAPf4RQi3cAu3wcx05TusBTDDHXdxAYiBGIhZcphz3DaYvO1mc+nnbwjbWvV6zOMRHPzCL/wS
//tQUTtQXMbu+g7TjGsAu7sEvQFtAyxCTgVcALvMBLzDb5mC0obl+1tgu2YAu2hGzMbodYVngHhjMYhmEY
//JmIL4s6HrrvNhSrsrcLeUv7iNeE7XoNe6IVe4rVTJfe10Zpgtgu5kEu0Nt07fENAV4Eu6IIusdq8n14b
//k1ofa7lAC7RAS6TGrHa8J9YgGIIhmDjNe5zWXC+JvZXaW5nrTgPP1kqvIVpu/GoSocEt3BKh+Y7QTozZ
//Y8FZb3xhFmZhltis9wLDyUKrgBZogZaobNCobPa8vmR1FlzBFVyJx5i9jhqKwS7swi6R2HSfMJMjOq28
///3wjkRkcwzGR2eSfOguS4Tf+nCOzYhiGYSK1Sd2zGzjECoiBGIiJ3Gb6dFog/Hr8nTHwBV/wJZJj9hvG
//82r9WX4GR9Nrgw==
