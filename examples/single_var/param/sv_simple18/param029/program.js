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
      var x = new Int8Array(data.x_sab); x[3] = 0;
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQRG5ziGtnTRUEI3bSFdZCkFsxCapguzKnn3arxg9NgaHaPCv5MzZ7yM8iE/
//I+VuH37vQylF4LveygvVnbDuA3+eHUu53fmbz6jheSEexM914Ctv7YX2LJpBx6ObmTipOmxVF6rE9hLb
//67DV5F7janKnSdWOOrYfwVdcV4XuYp1q6k5NXdfU3ZrrpvdzEI+vT+LlDWvWfM1KT++y1WIvsb3E9jps
//r8P2arZXl3uTd7xaLI8v+WSFs6eLZlrx7LpBOx2cc4Pqr0HKLr9MPzH2/PzsZOb7Op55uJIcAgQEgAAQ
//MIWAXUEgX2arfwKYq7aGQWkXNIAG0NDf/0G+nPYlaSADNNyCBtAAGjrRUPkxuBQMin3h3VlAngAUgMII
//8gSqDOYLrjqkCaV6ek5kDIABMEwhYzDBQuOEoTUWyB3ABbgYQe5glgvqjQtkEeACXAycRbTDolUS0ZoK
//5BOAAlCMcr9DvrBkLp/QyCcAA2CY8h6I81lom09o5BPgAlxMe19EFy6oNy6QT4ALcDG6vRJNsDCRT2jk
//E4ACUIw+nyjklSbTCYfFAtkEUAAKY88mjJLwXzLRFQrkEqACVAyVS/REBfVEBTIJUAEqhsgkOkJxTiLR
//nIlfO+Je8A==
