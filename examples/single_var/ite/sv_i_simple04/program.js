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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = Atomics.load(x, 0); report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 >= 1) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = Atomics.load(x, 0); report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = Atomics.load(x, 1); report.push("id8_R_t2: "+id8_R_t2);
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
outputs[1] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[2] = "id6_R_t2: 0;id8_R_t2: 2";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtls9rwjAUx+/7K3KcIMQmL6ZseFC2ssN+gE48lrHuUJh2h3oa+99XW62xvKymsbNIbuWbvJf348uH
//Upqs0691SimJo2E4DVN2Qwa3ceTvvildJtHHZ3bhYUJG5Ps6jli4CFOvn0Xw/KvXJwcqoKpQVI7e5ehd
//QNWi1o1aVFqoXnZj+RavNjpTbqs61+ig0YVGH2re3dbzQ8bPd+Tpxc3s+JlVulfVfe0M7YijKqCqWp2P
//ZvDRDH41Q7Hj6STIl3zwxq67LHKwiT4IVw7LJMHWKGgKPLqInC22kcbmzM/ek1U0CsaPs/veFa2jgedo
//cHJn86rqyNHufCt9/i9lLMlRFtCAG1x9upYaGluaM4M5ZpzV08Lxpbu7aIs6TfkiLPgijPgibPjiZXyR
//Hf8nOZd79/0MUY9JjdMlmkN2lhndmi+vmXr9P4LlhipVqKpEq5AGzCjnuyOGxI60xGDoswzlBT5ejSH3
//tHidzo+BBXOwaB8Wf1gRHFguCCyAqgLfsSlYoDFYwAAsYAEW5sByEjODg9AF7U2ce5vGEAI7CIEBhMAC
//Qr9eWIsP
