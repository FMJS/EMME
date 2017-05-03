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
      var x = new Float64Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1.toFixed(4));
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
      var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 2.0000;
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
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
outputs[0] = "id2_R_t1: 0.0000;id5_R_t2: 0.0000";
outputs[1] = "id2_R_t1: 2.0000;id5_R_t2: 0.0000";
outputs[2] = "id2_R_t1: 0.0000;id5_R_t2: 2.0000";
outputs[3] = "id2_R_t1: 2.0000;id5_R_t2: 2.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3EFvmzAYxvH7PgXHTYoGGGNLm3ZYVVW9bJO6Q4/RpOwQaV13SE9Tv3tJIQkB25DEENP8e6reF0hI
//yE/W+4TE8ePT6t/TKo6j5ULM7+ar9FOUfEyKv8/LRb4uiE0hjh8eF7//FJveXkVfov/vN3vMin2z+X3x
//34dZtFeVtWq5RbNaPsS6qtZV0azqWrXcollNi/8ffi3/zrZn0K7Xn129Li318vHbdWV53Or5PEdfv19H
//337w6phencbZ14+yqyrjtvUj7F6p+hF2VWXctn4EaTyCNB5BNo9Qvsd3Vzevb/Les9ycc7Fnst7b1kxd
//TeFqZq6mdDVzV1O5mrpq7q46w3kam6mrKVzNzNWUrmbuaipXU2/e2pvWx7e2lXnvcs+f99WefT501aX3
///C6GYAiGYO8ED8yh4fVK7K3U3hL2Vga9+/SaL9LDQHbDK4AXeIF3amvfNtnbk5b2Vm5vseq10quhF3qh
//Nxh6h19/elNVAa4D3O6LEG7hFm6DWemqM8wCWOGOO1wYHmJmvUAMxMRt54vbBpO32dxe+tkJYVujXh2z
//O4KDX/iFX6K2YKK2gNntHbR1Y8z4AXZhl6AtoDHEJODVwAu8wEvMNvmYLShuj5rtgi3Ygi0hG6vbIcYK
//wzPcmvEKGIZhGCZiC+KbD213txeqtLdye0v7i9ek73gNeqEXeonXLpXcY6M1efzQAXIhF3KJ1kD30BED
//6IIu6BKrTe7utTGp9THLBVqgBVoiNVa1492xdjTBzHQhGIKJ0zq/GJDYW6m9JVzfNPBsrfIaomXGjyYR
//GtzCLRGa7wjtwpjtCs5648tgAWZhltis94DhYqHVQAu0QEtUNmhU9uZ5PWQ6C67gCq7EY6xeRw3FTmWX
//GS3swi6R2PnuMFMjOq29/3wjkRkcwzGR2eTvOguS4RN/zpFhBAzDMJHapL6zGzjEGoiBGIiJ3N7o3WmB
//8Ovxd8bAF3zBl0iO1W8Y96v1Z/kF+sRroQ==
