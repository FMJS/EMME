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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 513;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 512";
outputs[7] = "id6_R_t2: 513;id7_R_t2: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUGavE0HigeHDC8qzMOORaiHgnMeupPsu9uuXem2t9ql6ZbBcytv3vRPWn6U
//h0i5XGXfq0xKkSZRPIszfSuCuzQZb4+lXCyTj8+84Wki7sXPdZroeB5napTPoM3RzUjsVEO2ahpVYnuJ
//7Q3ZanmvRbW807Kq8o7Fe/pV1HWju1mnlnrYUjct9ajlutX9rMXDy6N4fsWadV+zvaeP2Gqzl9heYntD
//tjdkew3ba/Z7y3c8m0w3L3lnhbdPl88Mitltg6oaHHOD+q9B2l5+Wn1i7Pn52eXMt3kxc30lOQQUEAAC
//QMAVAuoAgXqZg+EJYK5qDYNRGjSABtAw3P9BvZzqlDSQAxoINIAG0NCLhoMfg1PBoNkX3p8F5AlAASh4
//kCfQwWC94LpHmrBXr86JjAEwAIZLyBhcsNA5YbDGArkDuAAXHuQObrmgwbhAFgEuwMWZswg7LKySCGsq
//mvlE/pcBKkAFqPBlx0O9sOQuoTBWCQVoAA2gwZt9EMfDYJtRGMuMAmAADIDhze6IPmDQYGAQwAAYAMO/
//PRNduHCRUxjkFKACVFxATtFILl2mFCHLBTIKsAAW/M8onKLwX0LRlwrkE8ACWJwvnxgICxoIC2QTwAJY
//nCeb6EnFMclEdyh+AeWyYfg=
