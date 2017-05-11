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
      var x = new Int8Array(data.x_sab); x[1] = 3;
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
outputs[1] = "id6_R_t2: 768;id7_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZoMcGbAaFzYmMaNmtRFl8QEFyTWuqAr03cXyiUUDkq5tID/rjlzhsvQfGH+
//IOVmG3xtAymF79nu0g2sG2Hc+p6T/pZyvfHeP8KGx7m4E9+Xvme5KzcwZ+EM2v+6momDqmKrOlcltpfY
//XsVW42uNqvGVxlUz7Fi/+Z9R3cp15+tUUVcVdV1RtyvOm1zPTtw/P4inF6xZ/TUr3L3NVvO9xPYS26vY
//XsX2arZXF3vjZ7ycL/YP+WCF07sLZxrR7KpBMxl0uEHrt0FKT79I/mLs8fnZ8czXVTRzdyGBABAAAr0i
//YJYQyJbZ6J8A5qyNYXDsa9AAGkBDf+8H2XKap6SBQANoAA1np6H0YnAqGCz2gbdnAVsJoAAUBpAnUGkw
//W3CrRZpQqCfHBAyAATCMIWPogoXaCUNjLLC5ABfgYgC5Q7dcELgAF+BiqllEMywaJRHYhgAKQDGt7x2y
//haXu8gkNGAADYBjzNxDHs9A0n9DYcIALcDHu7yLacEHgAlyAi//zrUQdLLrIJ7ANARSAYvj5RC6v7DKd
//UCwWQAEoAIWhZxOdkvBXMtEWCmw0QAWoOFcu0RMVBCpABaiYUCbREopjEon6TPwA42ZfGA==
