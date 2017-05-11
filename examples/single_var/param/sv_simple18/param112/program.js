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
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 515;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 769";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 769";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 769";
outputs[15] = "id6_R_t2: 515;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYAiHcvphQ4NJXRpC+mQ0RTcwdA0HZyp5N1rx45xnOPWkeXL8G/m6MgX2XyY
//H0m52cbf21hKEYV+sAxifSumd1E4OxxLud6EH59Jw9Nc3IufyyjUwSqI1SSZQfujq4k4qnps1ZSqxPYS
//2+ux1exe02p2p1lVJR3r9+grretSd7lONXWvpm5q6n7NdfP72YmHl0fx/Io1a75mlaf32Wq5l9heYns9
//ttdjew3ba6q92Ttezhf7l3y0woenS2ZO09l1gyofnHGD+q9BOlx+kX9i7Pn52dnMt1U6c3chOQQICAAB
//IOAKAXWCQLHM0+4JYK5qDYNRGjSABtDQ3f9BsZyqTxrIAQ0GNIAG0NCKhpMfg75g0OwLb89COU9QQAEo
//AIVh8gQ6GSwWXLdIEyr1/JxnZgyAATAAhkEyBhcsNE4YrLE4zh3ABbgAF4PkDm65oM64MOACXICLYbMI
//OyyskghrKsr5xMy/BhWgAlSMZcdDsbDkLqEwVgkFaAANoGE0+yDOh8E2ozCWGQXAABgAYzS7I9qAQZ2B
//YQAGwAAY49sz0YQLFzmFscwpbkAFqAAVPeYUpeTSZUrhsVzYZhRgASyAhf4yCqco/JdQtKWimk8AC2AB
//LPrLJzrCgjrCwgALYAEsBskmWlJxTjLRHIpfW3NieA==
