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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 513;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 513;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 513;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 513";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 513";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 513";
outputs[15] = "id6_R_t2: 513;id7_R_t2: 513";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYAiHSuBlg4NJXRpC+mQ0RTcwdA0HZyp5N1rx45RnOPWkeXL8G/m6MgX2XyY
//H0m53SXfu0RKEUezcBUm+lZM7+JofjyWcrONPj7ThqeFuBc/13Gkw3WYqEk6gw5HNxNxUg3YqrGqxPYS
//2xuw1fxes2p+p3lVpR2b9/grq2ur265TTT2oqZua+qzmusX97MXDy6N4fsWaNV+zytPP2KrdS2wvsb0B
//2xuwvYbtNdXe/B2vFsvDSz5Z4ePTpTOn2ey6QVUMzrlB/dcgHS+/LD4x9vz87Hzm2zqbub+SHAIKCAAB
//IOALAXWGQLnM0+4JYK7qDINRGjSABtDQ3f9BuZyqTxrIAw0EGkADaGhFw9mPQV8waPaFt2fBzhMUUAAK
//QGGYPIHOBssF1y3ShEq9OOeFGQNgAAyAYZCMwQcLjRMGZyxOcwdwAS7AxSC5g18uqDMuCFyAC3AxbBbh
//hoVTEuFMhZ1PpH8ZoAJUgIqx7HgoF5b8JRTGKaEADaABNIxmH8TlMLhmFMYxowAYAANgjGZ3RBswqDMw
//CGAADIAxvj0TTbjwkVMYx5yCQAWoABU95hRWcukzpQhYLlwzCrAAFsBCfxmFVxT+SyjaUlHNJ4AFsAAW
///eUTHWFBHWFBwAJYAItBsomWVFySTDSH4he85WIA
