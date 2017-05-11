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
      var x = new Float32Array(data.x_sab); x[0] = 2.0000;
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
      var x = new Float32Array(data.x_sab); x[2] = 2.0000;
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
outputs[1] = "id6_R_t3: 2.0000;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 2.0000";
outputs[3] = "id6_R_t3: 2.0000;id7_R_t3: 2.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt289PwjAUB/C7f8WOmhAH7domGg8SQ7yoCR44EhM8kIh4gJPxf3e/ZAVeOxAYbff1tLy3PtcNPrar
//jeP5cvG1XMRxNJ3I8XC84DdR97qb/txOJ2otEMez+eT9Iz31sR/dRd+X0wkbj8aLXidty/Ojq06URpPs
//mGVRkR8V0aJ6Fi3KFtFeesbsbfqZxZlWQ49zQzzRqutxYYhLw+8tr+cnun9+iJ5eQuzbxrUzskd0PyVZ
//Qa8ryLqCrCvIuoKsW91VvW4V1esq8ly1eW7xjIf9Qf6Q16r93bW0ZTdrbUr2bElmS3JbMrElhS0pbUlV
//JpWtn8rWT2Xrp6L7Wd7mQflVIq+Mbl20fB2VLff5+l7EwAyYAbNmMDuxV8Tt4i5TJmse2S7A2SFjgAyQ
//AbJmR2XbVq26l5hTwpxSfiDGgRgQA2JHQmzVrmse3fTMKVY/JjqaT9IbuvZ5cIALcAEuF0dfskHblH8T
//SMAG2ABbC6aVq49AYk4Jc8oT2vQPOhADYkDMl2nlgT5Jb+iiHxzgAlyAK9BpZTvGXoANsAG2oKeVe73X
//30U9D1crQRtoA22BrGGG/p6s/sGBM3AGznwcqYkGxQtmZfP03G3tB2Ct4C6PVz1qC4JVj/TqVVSQUWm7
//Z3mUk3U5WZeTdTlZ938QW3HFlqftsasyj12VeeyqKMn33urE9L9NtRudtr+yYA2sgTVsfnIAtbpNTzR1
//u5LGQBpIA2kt2QblFGccnIEzcHYyzkLdEHUWxP7xuhSEgTAQ5viI7Lxbo5ydXoI4EAfiWjnpPPo/fziF
//HL3iCc7AGTjzbdLZ5HYphyadIAyEgbDWTDrDHo+BOBAH4lo26WxgC5WzK51ADsgBuWDXP0N9n3b4rgLA
//BtgAmx+jt/Nuq/JsVfRY8P0Czce1sA==
