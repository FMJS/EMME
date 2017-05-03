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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 257;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 769";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 769";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 769";
outputs[15] = "id6_R_t2: 257;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYAiybJ6oUNDCV3aQjpkNAV3MDRNB2cqeffa8QXHOW4dWb4M/2aOjnyRzYf5
//EefbXfy9izlnUegHqyCWt2x+F4WmOOZ8sw0/PpOGpwW7Zz+XUSiDdRCLWTJDHY6uZuyo6pFVXakqsleR
//vR5Zze41rWZ3mlVF0rF5j77Suqx0V+uqoe411HVD3W+4bn4/e/bw8sieX7Fm7des9vQ+Wa32KrJXkb0e
//2euRvZrs1fXe7B2vFsvDSz5a4eLpkpnzdHbToMgHDTUo/xpUxeWX+SdGnp+enc18W6cz9xecQkAAASAA
//BFwhIE4QKJd53j8BxFWtYZDaBw2gATT0939QLqcYkgblgAYDGkADaOhEw8mPwVAwSPKFd2ehmicIoAAU
//gMI4eYI6GSwXXHZIE2r1/JxnZgyAATAAhlEyBhcstE4YrLE4zh3ABbgAF6PkDm65UL1xYcAFuAAX42YR
//dlhYJRHWVFTzCeNfgwpQASqmsuOhXFjlLqHQVgkFaAANoGEy+yDOh8E2o9CWGQXAABgAYzK7I7qAoXoD
//wwAMgAEwprdnog0XLnIKbZlT3IAKUAEqBswpKsmly5TCI7mwzSjAAlgAC8NlFE5R+C+h6EpFPZ8AFsAC
//WAyXT/SEheoJCwMsgAWwGCWb6EjFOclEeyh+ASPYYpA=
