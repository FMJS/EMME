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
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 259;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 259;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 257";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 257";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 257";
outputs[15] = "id6_R_t2: 259;id7_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0OZmUKC4sUtyoUBddBiEuAta6SFfSdzdpLkzTE00nk8vi34UzZ3KZhI/w
//M1Lu9sn3PpFSxJEfrsPEvRXzuzhalMdSbnfRx2fa8LQU9+LnOo7ccBMmziydQcejm5k4qXpsVWlVYnuJ
//7fXYan6vWTW/07zqpB3b9/grq7tat16nhrrXUFcNdb/husX9HMTDy6N4fsWatV+z2tP7bFXvJbaX2F6P
//7fXYXsX2qnpv/o7Xy9XxJZ+scPl06cx5Nrtp0CkGF9yg+9cglZdfFZ8Ye35+dj7zbZPNPFxJDgECAkAA
//CNhCwDlDoFrmef8EMFc1hsFVPmgADaChv/+DajmdIWkgCzQEoAE0gIZONJz9GAwFg8u+8O4s6HmCAxSA
//AlAYJ0+gs8Fqwd0OaUKtXpzzwowBMAAGwDBKxmCDhdYJgzEWp7kDuAAX4GKU3MEuF9QbFwG4ABfgYtws
//wgwLoyTCmAo9n0j/MkAFqAAVU9nxUC0s2UsolFFCARpAA2iYzD6Iy2EwzSiUYUYBMAAGwJjM7oguYFBv
//YAQAA2AAjOntmWjDhY2cQhnmFAtQASpAxYA5hZZc2kwpPJYL04wCLIAFsDBcRmEVhf8Siq5U1PMJYAEs
//gMVw+URPWFBPWATAAlgAi1GyiY5UXJJMtIfiF5EzYmA=
