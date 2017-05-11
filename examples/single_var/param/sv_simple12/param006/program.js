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
      var x = new Float32Array(data.x_sab); x[0] = 0.0000;
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 0.5000;
      var x = new Float32Array(data.x_sab); x[2] = 0.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt20FPwjAUB/C7n2JHTYhj69omGg8SQ7yoCR44EpN5IBHxME7G7+7GJivw2oHAaLu/p+W99blu8LNd
//bRjOF9nXIgvDYJqKyWiSsZugf93Pf26nqVwLhOFsnr5/5Kc+DoK74PtymsaT8SSLenlbtjy66gV5NCmO
//4yLKl0dltKxeRMuyZTTKz5i9TT+LeKzUUONME0+U6mqca+JC83ur6/kJ7p8fgqcXH/u2ce0x2SO6n4Ks
//oNblZF1O1uVkXU7Wre+qWreOqnUlea7cPLd8xqPBcPmQ16r93bW8Zb9orUtGpmRsSjJTMjEluSkpTElZ
//JaWpn9LUT2nqp6T7Wd3mYfVVIq+Mbl22fB1XLff5+l6EwAyYAbN2MDuxV8TtYjZTJhoe2S7AATJABsis
//GpVtW7XqXqJPcX1KuoEYA2JADIgdCbFVu75+dBPpU3HzmOhoPgln6NrnwQEuwAW4bBx9iRZtk+5NIAEb
//YANsHZhWrj4CiT7F9SlHaFM/6EAMiAExV6aVB/oknKGLfnCAC3ABLk+nld0YewE2wAbYvJ5W7vVefxf1
//HFytBG2gDbR5sobp+3uy5gcHzsAZOHNxpMZbFM+blU1wd0oS6h51BcG6R2r1OsrJqDDds2WUkXUZWZeR
//dRlZ938QG3HFlqftsavUj12lfuwqKcn33uoUq3+bGjc6bX9lwRpYA2vY/GQBak2bnmjqQBpIA2lOjdRa
//2AZlFWcMnIEzcHYyznzdEHUWxP7xuhSEgTAQZvmI7Lxbo6ydXoI4EAfiOjnpPPo/f1iFHL3iCc7AGThz
//bdLZ5nYpiyadIAyEgbDOTDr9Ho+BOBAH4jo26WxhC5W1K51ADsgBOW/XP319n3b4rgLABtgAmxujt/Nu
//q3JsVfRY8P0CKYi1dg==
