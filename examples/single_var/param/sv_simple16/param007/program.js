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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t2 = Atomics.load(x, 0); report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = Atomics.load(x, 1); report.push("id7_R_t2: "+id7_R_t2);
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
outputs[1] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 131072;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 131584;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 131072;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 131584;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt28tOwkAUgOG9T9GlJiSlM1NqNC4khrhRE1ywbEzqoomIi7IyvruFFmxhClR6mcK/I2fOtNMLX04y
//PbY9m0df88i2rTAY+GM/EjdW/zYMvNVv257OgvePOOFxaN1Z35dhIPyJHzm9eIZc/rrqWbmo0kbdTFRq
//c6U2V2mjyVoX0WSlSdSJM6Zv4eciLjLZ2bgsiKuCuFsQHxScN13Pj3X//GA9vXDPDr9nG1c/0EazuVKb
//K7W5SpurtLmuNtfdzE2e8Xg4Wj7k3B1eXV08s7+YXTTo7BoUuwZlOujtmunpZ6YLH6Uvp/b4+tnJzNdJ
//OrPMH+LCBhuwAZtasTnek7/B9QPq10+N5qylAQIaoAEaE6qaktCsH4TTJDQSaIAGaEyH5tiipW1mhPYV
//qgsf1xHwAz/wY2Kdo1oBSEEN1EDNOVU6yqBKpy5+HOn0PQRCIAQyYKtqm6f1jRVNGuSiDdqgTff3qkrV
//O+1Yo693EAiBEOgE6p0D9qnaFkgiEAIhUIcFOm4Dy8wKqHGV3GuFSqiESi3VRco0lxQCIRACnUtdpLpR
//FzWrUvYzRAFIgARIXevi2h7McPb/Hq6NeHrM/Z1dQAM0QHN6HVxVMHNw/9Z+fGAGZmDm9Pq3qmVGwgzM
//wAzdW03VMvXTk2+oAB/wAZ+O9W5Vy48CGqABGjq32qhy6sJn6ytC/MEf/OlY31a1ArlYgzVYQ9dWS7UO
///uAP/tCz1ey2Ff7gD/7QsWXSflYjJuW7JTAJkzCpU/1a9W1z4Q/+4A/dWibtflVp0i9BhG/I
