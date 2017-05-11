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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt28tOg0AUgOG9T8FSkyYUptBE48LGNG7UpC66JCa4ILHWBV0Z311uhbEdSlEYLvl35MzMaWHolxPH
//Y5rbXfi5C03TCHzXW3mhuDamN4E/31+b5mbrv71HEx4Wxq3xdRn4trf2QmsSrRDJ1dXEiKKz+NqOo05y
//lUbTnHE0zZhGrWjG5jX4iOO2lEOOi5L4TMoux52SuFvyudn3+Tbunu6Nx+cx3lsSL+5Izl5EHWXUVWaQ
//8wplXqHMK5R5hTJv8axdZVSe6yjnOodz0z1eLZbJJv/auf1Ti1ZO49Vlg9apQfvUoMgG56dWztUrsy++
//zF5OZX716nTlyzpbWecHcWGCAiiAQkO/+2Iw3/hp+yQoPrU2FIAACIBQp0qoCUK+wZZOEAQgAAIgNAXC
//f4uArjmQXzaQAAmQ6HnVkD8SrUzIGwEIgAAIPakauuFAXTWABEiARA9OJI4FyW/e1smEAwiAAAhaTiNq
//VQ3dcKCuGkACJEBCT9VwxiFE10gIkAAJkGgXif8dTPSzjgAO4ACOflUXR3+d7JqOmfLVBAmQAIluqove
//EVF9tgEcwAEcI+nBOB6U2Pl7B8ZBPMtZ3ZcBCIAACN31XzTBwdndF9VIwAEcwEF33RfNciDgAA7gYKi9
//F+3VBhABERAxis6LZpGo+JdqOIADOOhv34WOigEiIAIiBtx10SwSDhzAARwMtedCR8UAERABEYPtuGjv
//TAIiIAIiBt9vofucAjZgAzZG0G3R3tkFREAERAy+10L3eUaTbPwA2tADHA==
