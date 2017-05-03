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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[1] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 512;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQTGmeMYaOmioYRu2kK6yFIKZiE0TRdmVfLu1XjBJMfW6BhN+u/CmTNexvCh
//v0q5Wkdf60hKEQaeP/MjfSucuzAY57+lXK6CxUfc8DQR9+L7Ogy0P/cjNYpn0PbXzUjsVF22akpVYnuJ
//7XXZanqsSTU90rSq4o7le/iZ1HWpu1ynirpbUTcVda9iv9nxbMTDy6N4fsWa1V+zvbP32Gq5l9heYntd
//ttdlew3ba/Z702s8m0y3F3lnhfOzi2c6yeyqQZUNjrlB/dsg5bufZn8xdvv87HTm2zyZubmSQAAIAIFO
//EVAHCBTL7HRPALPXxjAYpUEDaAAN3d0fFMupTkkDgQbQABp6p+HgxuBUMGj2grdnofwooYACUAAK/eQJ
//dDBYLLhukSbs1bNtAgbAABjOIWOwwULthKExFrsPF+ACXICLXnIHu1wQuAAX4OJSs4hmWDRKIqw8hiC0
//BBSAYjDfOxQLS/byCQMYAANgOOdvII5noWk+YRo+cIALcAEuBvJdRBsuCFyAC3Dxf76VqIOFjXzC4DUp
//oAAUg88nSnmlzXTCZbEACkABKAw9m7BKwl/JRFso8CIUVICKvnKJjqggUAEqQMUFZRItoTgmkajPxA8f
//FV64
