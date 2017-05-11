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
      var x = new Int8Array(data.x_sab); x[0] = 2;
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
      if(id4_R_t2 <= id5_R_t2) {
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
outputs[0] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmjtvwjAUhff+iowgIQV8iZFaMYBa1KEPCVoxRlXTIVKBDmGq+t+bF8VJnTYPG4I5m3VJTrDjT/f4
//KLa92QYf28C2Ld8bunM3YJcWu/I9Jx33w/FoN7bt1cZ7ew8vvp1aY+uz43vMXbrBoBfeTfGo27M6O6Wo
//mujkqyOh6kirg1Bt9eKvozoTlMU6FdSHBTpOQT197pc1ebi27h/Nm1lc389nKK060qqoQFIFkipQXiFZ
//3fl0Fi9vZs1+VqEf3ZtZuN1khB9H8h9T/Vn69iTqRcJyzURvsYz0knG8tq+btTeeTe4WN90LG/AAnmPD
//Q1rhoXbAwwAP4GlR5xHuU9R30qsBDsAxueuUAYcADsBBx8mCQ8o7DgEcgGN+xyHlHachOP0cOFxRQKB7
//y+yfyqXblxdo8Mbg6J5ZlU1fZXs3XLHcv+DS5/F/wZHQ8Sc6vGJEkMWkCB9eLSR4mj+X4YeBH/BzTH5+
//2TlV9IjvSR07DOyAnQOy88dppzE58tMOuAE3p88NaeSGDsgNvBq4aY1XI11ejdBzwI7JXo30eDVwA26M
//9mqkx6uRdq8m5tIM3ICbVuXSZT4iqJpKl/iMoMY5B+yAnTZl0k3IkScEzbhh4AbctD6Prv+1J5gBM+eZ
//Rdf/0FMHM/BnYOYUcugm/ozQa8DNWWbQ9f0ZmAEz55k/1/dnpNmfIXsGM+3NnklD9kw424Ad47NnUp49
//E3wauDE8eybF2TOYATOmZ8+kOHuGPwMz5mfPpDx7Rq8BN6Znz6Q4ewYzYMb07JkUZ89lmfkGo+10IQ==
