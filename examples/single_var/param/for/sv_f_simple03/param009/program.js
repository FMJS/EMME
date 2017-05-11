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
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); x[i+1] = i+2;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      for(i = 0; i <= 1; i++){
         var x = new Int16Array(data.x_sab); id4_R_t2 = x[i]; report.push("id4_R_t2_"+i+": "+id4_R_t2);
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
outputs[0] = "id4_R_t2_0: 0;id4_R_t2_1: 0";
outputs[1] = "id4_R_t2_0: 2;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 512;id4_R_t2_1: 0";
outputs[3] = "id4_R_t2_0: 514;id4_R_t2_1: 0";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 3";
outputs[5] = "id4_R_t2_0: 2;id4_R_t2_1: 3";
outputs[6] = "id4_R_t2_0: 512;id4_R_t2_1: 3";
outputs[7] = "id4_R_t2_0: 514;id4_R_t2_1: 3";
outputs[8] = "id4_R_t2_0: 0;id4_R_t2_1: 1024";
outputs[9] = "id4_R_t2_0: 2;id4_R_t2_1: 1024";
outputs[10] = "id4_R_t2_0: 512;id4_R_t2_1: 1024";
outputs[11] = "id4_R_t2_0: 514;id4_R_t2_1: 1024";
outputs[12] = "id4_R_t2_0: 0;id4_R_t2_1: 1027";
outputs[13] = "id4_R_t2_0: 2;id4_R_t2_1: 1027";
outputs[14] = "id4_R_t2_0: 512;id4_R_t2_1: 1027";
outputs[15] = "id4_R_t2_0: 514;id4_R_t2_1: 1027";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHB4U0byuC4sEhw4sK87BjEOah4JyH7iT77nZ/Opv2zdiadLr0uW1592ZtUn60
//D5Vyvsi/FrmUIpumeqxz0vGNiG9331TxTcrZfPr+UfzocSjuxPdlNiU90bmKiq5k/UnHg0hw48oyTpvx
//srvZwVTMHma28gyi37PZzqaK383ess9VZXMszXHzTJiKvYealfJYrBU1WIr75wfx9II19bemtZUxOxrj
//zLqYHUxFNVeM7bH/D1l7iLk+xsPR+gKp7UV59kX/eg57WZllVSvT/nJSHsZoe5la/sU2w6b7dbLqXl5I
//HhwCOAAH4JwLOIoBZ7ch8Ym5ieuXQ3uGrhQgAkSA6KzvfCoLr/6CInPjXTBKgREwAkb/GiPbbc8JKWLu
//fbxCZKZBCRgCQ2Ao1DQoYcqVzSHHNKhR2c3dIicCRaAIFAWaE3mH6LCcyBGoeoIEokAUiAo2QeoGqQMe
//3JyZSsEUmAJTfciWXJByyJYciTJTJxVTCqNgFIzq02tIlS1IOgqeqE3wBI2gETTq1ztKTha5ZU/ULnuC
//UlAKSvXtBSZ3pxye7ahd/ASpIBWk6tfbTYc61UECRS0TqGsYBaNgVFAJlBGEd5FAmdvrMYGCRtAIGoWU
//QHVp0d4EypdRTAIFpaAUlAorgercKfuznT+pUkgFqSBVyAmUJ6eOT6COVeoHnXprVg==
