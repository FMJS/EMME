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
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      var x = new Float32Array(data.x_sab); x[2] = 1.0000;
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
outputs[2] = "id6_R_t3: 0.0078;id7_R_t3: 0.0000";
outputs[3] = "id6_R_t3: 0.0000;id7_R_t3: 2.0000";
outputs[4] = "id6_R_t3: 2.0000;id7_R_t3: 2.0000";
outputs[5] = "id6_R_t3: 0.0078;id7_R_t3: 2.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt289PwjAUB/C7f8WOmhgH7doajQeNIV7UBA8ciQkeSPx1wJPxf3e/ZAVeOxC2td3XE3ndnnSDD69r
//Xhx/fC0+vxZxHM1ncjqeLvhFNDgbpH+X85laCcTx28fs5TU99O4muoq+j+czNp1MF8PT9Fyevzo5jdJo
//kr1mWVTkr4pokT2LFmmL6DA94u15/p7FmZZDj3NDPNGy63FhiEvD/y3fz090/XAb3T+GOLe1987IGdHz
//lGQGPa8g8woyryDzCjJvdVX1vFVUz6vIY9X6scU9Ht+M8pu8ku3vqqVnDrKzTYND2yCzDXLbYGIbFLZB
//aRtU5aCyzVPZ5qls81T0PMvLPCq/SuQ7o88uznyalGfu8vU9ioEZMANm7WDWsFfE5eIuUyZrbtk2wNkh
//Y4AMkAGydquyTauW00vMQ8I8pPxAjAMxIAbEDoTY8ryBuboZmodYfU10MJ+kN3TtcuMAF+ACXC5WX7JF
//25R/C8jmYcPzMcAG2DpfVi4/Aol5SJiHPKFN/6AfGjF1DsSAGJaVzSwr9/RJekMXfeOahAvVF+BC9dXh
//srIftRdgA2yALehl5U7P9bdRz8PdStAG2kBbIHuYoT8nq79x4AycgTMfKzXRonjB7Gx2wB3rBXd5vJpR
//XxCsZqRnr6KCjErbNcujnMzLybyczMvJvP+D2IorWp42a1dlrl2VuXZVlOQ7tzox/bepttFp8ysL1sAa
//WEPzkwOo1TU90dRtSxoDaSANpPWkDcopzjg4A2fgrDHOQm2I6gSxfzwuBWEgDIQ5XpF12xrl7PKyWeLw
//HA3Egbi+NEk5hRy947k/ZyuNUeAMnGHRGVS7lEOLzqYIQ0UGwkBY+I1THiw6QRyIA3HBLjpbaKFydqcT
//yAE5IBfs/meoz9P27yoAbIANsPlRvXXbVuXZruih4PsFq8K1tg==
