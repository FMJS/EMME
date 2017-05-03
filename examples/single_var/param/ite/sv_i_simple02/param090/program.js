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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 >= 1) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 0;id8_R_t2: 2";
outputs[2] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlk1rg0AQhu/9FXtMILBxP9zSkkNCKz30A0xDjlJiDkITezCn0v9edTXdyCwaTdDC3JbXd9bZmX2Y
//pTQ+JF+HhFIShW7gBwm7I9P7KLwt15Tu4nD7mRqeFmRGvkdRyIJ1kDiTNILnq/GEnKgCVKWhctDLQa8A
//VZ1rpupMteqkjt1HtM90ZrhNnVt0YdGlRXct/y3y+SHz1wfy8oY1a16zyuldUDW9HPRy0CtArwC9EvTK
//qlf32F94eZNPKlyeLo2cZtGjMqjy0Sk38YqLAm4BR+vI5TqL1Ou8rJt4H868+fPycXxD6/hmyDfyjXxf
//lu9jOVvQXcQi28g2sj1AtmUHtmU3tlnKthr4u7yvG/lXfGW5p2qwbPdVM1ZDoFtLIMxa415UslBgFgrM
//QoFZqFq2j/UtyVYw9la2zQap897k7/4K0Ua0Ee3roC26oi2ujjZDtBFtRPuSU9v4dObMZvWvccQasUas
//+5jYTbAWiDVijVj/p2ktWk9rgVgj1oj1MKe1aD2tm2L9C/tLLqc=
