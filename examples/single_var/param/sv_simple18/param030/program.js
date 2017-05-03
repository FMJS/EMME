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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 259;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[7] = "id6_R_t2: 259;id7_R_t2: 256";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9rgzAYBvD7PkWOGxRS8xpLN3ZYGWWXbdAdepSBOwjruoM9jX73abVi9XWzMbYpPDd588Y/UX7I
//Q6Rcb5LvTSKliKMgXISJuhXjuzia7I+lXK2jj8+04Wkm7sXPdRypcBkm3iidQbujm5E4qPpsVVeqxPYS
//2+uz1fxes2p+p3nVSztW7/FXVleV7mqdWup+S1231IOW6xb3sxUPL4/i+RVr1n3Nak8fsNVqL7G9xPb6
//bK/P9mq2V9d783e8mM13L/lghfdPl84cZ7PbBr1icMINqr8GaX/5efGJsefnZ+cz35bZzO2V5BAgIAAE
//gIAtBLwGAuUyj4cngLmqMQxKB6ABNICG4f4PyuX0TkkDWaBhChpAA2joRUPjx+BUMCj2hfdnAXkCUAAK
//DuQJ1BgsF1z1SBNq9eKcyBgAA2C4hIzBBgudEwZjLJA7gAtw4UDuYJcLGowLZBHgAlycOYsww8IoiTCm
//oppPpH8ZoAJUgApXdjyUC0v2EgptlFCABtAAGpzZB3E8DKYZhTbMKAAGwAAYzuyO6AMGDQbGFGAADIDh
//3p6JLlzYyCk0cgpQASouIKeoJJc2Uwqf5QIZBVgAC+5nFFZR+C+h6EsF8glgASzOl08MhAUNhAWyCWAB
//LM6TTfSk4phkojsUv7oAYlg=
