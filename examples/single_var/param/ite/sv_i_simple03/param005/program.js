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
      var x = new Int8Array(data.x_sab); x[0] = 0;
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2UFPwkAQhuG7v6JHSUgKDPSg4SBR4kVNUMOxMdZDEwEP5WT877a0yKJLgu02mtn31ky307LNk074
//wnC1zt7WWRgGaTKMZ3E2OAt652kyMo6j7XEYLlbJy2u++HoSjIP30zQZxPM463fzq2Vz1OkGp9tORbXs
//U1b7+YrFU7os6gNjtVmXA/XhgT5m/91dI6M6slbNHlX9I7i4vQxu7v7hL9s9y9BaNdeKda1Y1zbcsW9P
//EVnvt7e7s8l0s7179952zq/sFVfvPYLlZGQ/Wd1hWr0/a/9Dre1dy47386JjebzZh+fVMhk/zB6vOich
//fvDz136+dqwVPeb7wA52dNmRVu0IdrDj59z246Pkamoz3xN2sKNuZmssxz6x4QY3que1xm4EN7jxcVaT
//tmY1wQ52NM9q0s6shhvcqJ7VpJ1ZDTe48TkPNb5UztLQqid2sKM4Cz1Gzu+SUNzgRn8OeowbwQ1uyECd
//TWr2f6Rxgxvt+Wf9KQ0zmPEz+6w/oWEGM77mnk3mM8ENbrzMPOvPZ5jBjJ95Z/35DDOY8TfrlBayTsEO
//dtRnneI868QNbvRnneI868QNbvRnneI868QNbrRnneI468QMZrRnneI468QMZvRnneI868QNbrRnneI4
//68QMZrRnneI46zzWzCeVeHJx
