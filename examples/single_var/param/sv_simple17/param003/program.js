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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 2;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 514;id7_R_t3: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2z1vglAUgOG9v4KxTUwQ7lWTNh1qGtOlbWIHR9KEDia1dsCp6X8vCCrqRcHcD6rvZs79AESfHDg5
//vj9fJN+LxPe9adyPxlEibr3u3TQerD77/mwef3ymE56G3r33cz2Nw2gSJUEnXSGWn2463lZUlqJCGc2P
//lEXz4+TRIJ0xe59+ZfGwNLscFxVxWRHvZfFwP96vOG5xPr/ew8uj9/x6OVe8c0XlXTbRvnJueQeh3EEo
//dxDKHaRyB6ncQSp3yNftzt1Et+7xeDha3uSte7T6ftKV3Wx11WBwaDA8NCiKwcGhlQP1yuLER8WPU7m/
//enW+8m1SrGzyh7jyVVSEUAEVUKFLg83g+hZ3zUOhOGpjPg4z0QuAAiiAok5O0RCK9a0MbEIhjEEhgQIo
//gEJP0uCaiVD5IzSFB+8toAM6DOQY0gke0hATPIrABExozzBkizIMSYYBHdDR1srIvivrCwpt4lH+Gskw
//YAImbFdFGmUYbpBQZxim6KBSAh7gUS/HqFEMcY2HsIwH1RPwAA8tBZJ25h12QeF9B5zAyWm5iGwbKNIq
//HTzGQAd0aCmktDMTkWQicAInl9KTsj9Ywuj0jpSdeLHn8T4Vsg6YgIm29aPoQKJ2N8pxOqixwARMtK8b
//RS8TwhgTVFNgAiYc9aKYyyXM08HbCuAADmedKHrpkIaQ4CEEJEDCUR+KjexCkl0AB3CcWxeKXjqOFEzJ
//LkACJP5bD4qN7MIUHFRHoAM6nHWgmKuN2KCDigl0QIeT/hPb9RLznPCeA0zAxFH3ibkaCu8+gAM4zrT3
//xHZdRScmf/oUnhQ=
