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
      for(i = 0; i <= 3; i++){
         var x = new Int8Array(data.x_sab); x[3] = 40.0+i;
      }
      var x = new Int32Array(data.x_sab); id3_R_t1 = x[0]; report.push("id3_R_t1: "+id3_R_t1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2.toFixed(4));
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
outputs[0] = "id3_R_t1: 721420288;id4_R_t2: 0.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlEFrwkAQhe/+ijkqSHdnRqhYeqgU6UUFPXgMQjwEau0hnor/3a0bJcnu5GbQMDmF93ZmJ/s2nzGH
//Y/57zI2BLOVkleQ4gVfCEVkaj9+ydPSv0QTsi3WPMftDuvt2q7+m8A5//SylZOOKEjuE2zsOhhB3SHQ4
//dPw4FR3FXij2QqEXiRUkVHBdR6fvt9lPqZMVHbmGRIdDR9rfBzU4wcfiE+ZLTecR0wlOMaKjoJOgc133
//MwR3YjWdXS5FZcV1Rld5ORvJxCaTArN0QFyYfhZhz6iJTSY1mXz95FnxG0THliaOd/Ud15uiY+zX6xml
//qdJU01GaPj9NSxHfg6Y1/bZbmbLKU+WppqM87RJPsVWeovJUearpKE87y1NqlaekPFWeajrK087ylFvl
//KVd5egbOsrLn
