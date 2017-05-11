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
      if(id4_R_t2 >= id5_R_t2) {
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 0";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[6] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmktvgkAUhff9FSw1MUHnypi0caFpTRd9JNrGJWlKFyRVu8BV0/9eEKhAh4bHDI7Ts5tcnQNc+HIu
//J9j2bh987APbtnxv7C7dgF1awyvfc5I1C9eTtG7bm5339h7++XZuTa3Pnu8xd+0Go0G4mw6r/sDqpUpR
//NdYpVieZqiOsjkK1zYu/jeoso5ytU0l9XKLjlNST435Zs4dr6/7RvCs71I/XMxZWHWE1q0BCBRIqUFEh
//7u5yvji0N9ez9IzDncNod651P61If5qI9yX6i+TuCdXFwmLNWG+1jvTi9aG3r7utN13M7lY3/Qsb8ACe
//U8PDinxIRCfbYYADcOA6eeAkeU6iCHAAjrmOUwWbOn6jCBoGaACNRm5D0t2GAA7AMd1tSLLbSIQmWnNJ
//I5rqx+V4VC58dHmJBm8Njeorq/PA13m0W3ascBZceDzezm0EP3JJmVq+zuuFA0/LZ/ADfnTg5w/TkUCP
//2HhUscPADtjpkB1Syg51yg58B+xoM7f9MiVZU1v2PoEdsGPczNaaHPHEpoYbzGvgRpN5rTU3dCJuGLgB
//N6fjhtRwQ5jTwM0/zqbbfHlTlhBU+IwA7ICdM8+lm398o4YbvOOAm3PIpKtwQx1yA78BN+eQR7eZ1MTp
//ALgBN6Zn0c2nNBXMYEYDM/rn0M0nNNXMIIMGM3pm0M2ZoQ5nMwZmwIxW+TMpyJ8J7IAd4/Nnkp4/k5J3
//G3ADbnTKn0l6/gy/ATfm588kPX8GN+DG9PyZJOfPmNHAjOn5M0nOn0lJ/gxmwIw++TNJzp+rMvMNdMVz
//6w==
