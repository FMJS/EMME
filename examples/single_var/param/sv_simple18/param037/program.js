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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 513;id7_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmM8cx0NJFQwndtIV0kaUU7EJomi7MquTdq/GC0WNrdIwK/07OnPEyyof8
//jJS7ffi9D6UUge96ay/Ut2J+F/iL7FjK7c7/+IwanpbiXvxcB772Nl6oZtEMOh7dzMRJ1WGrplAltpfY
//XoetJvcaV5M7Taoq6ti+B19xXRe6i3WqqTs1dVNTd2uum97PQTy8PIrnV6xZ8zUrPb3LVou9xPYS2+uw
//vQ7ba9heU+5N3vF6uTq+5JMVzp4umjmPZ9cNqnRwwQ3qvwYpu/wq/cTY8/Ozk5lvm3jm4UpyCCggAASA
//gC0EVAWBfJnn/RPAXLU1DEZp0AAaQEN//wf5cqpL0kAWaCDQABpAQycaKj8Gl4JBsy+8OwvIE4ACUBhB
//nkCVwXzBdYc0oVRPz4mMATAAhilkDDZYaJwwtMYCuQO4ABcjyB3sckG9cYEsAlyAi4GziHZYtEoiWlOB
//fAJQAIpR7nfIF5bs5RMG+QRgAAxT3gNxPgtt8wmDfAJcgItp74vowgX1xgXyCXABLka3V6IJFjbyCYN8
//AlAAitHnE4W80mY64bBYIJsACkBh7NmEVRL+Sya6QoFcAlSAiqFyiZ6ooJ6oQCYBKkDFEJlERyjOSSSa
//M/ELUQ1euA==
