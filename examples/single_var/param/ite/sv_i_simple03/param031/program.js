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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[0] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 == id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
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
outputs[0] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm0tvgkAUhff9FSw1MUHnypi0caFpTRd9JNrGJWlKFyRVu8BV0/9eUKwjHVIedxoYz25y0YMz8OVy
//joPrbrbRxzZyXScMhv7cj8SlI67CwEvH/Xg8Ooxdd7UJ3t7jD99OnbHz2QkD4S/9aNCLv027UbfndA5K
//SXWvk62OlKqnrQ5itdVLuE7qQlFW65RTH+boeDn19LxfzuTh2rl/tG9mu/pxPkNt1dNWVQXSKpBWgbIK
//+9WdT2e75T1Zs5/Z9pPvnizcYTLKwZH+YKo/S6+eRj1PWK+511ssE739eLe2r5t1MJ5N7hY33QsX8ACe
//BsMjsod40FHXnRGcvgKOADgAxzA4mtbi5VNVFp3T/uJpkQI8gKel8Ij8rlMbHaHtOobAweMawGmD11GA
//Y3I6qSLAATj2+pzq2OhdTk1o8JgGaNrgcYpgU87hAByAY72/KYJNGXdj6BFNABpA0yBvQ+zehgAOwLHd
//2xCztyEzj2iABtA0ydsQu7cBOADHem9DzN6GEZpkLJkCAdO3y/GsUnvryhwNWRsa0zMrc8OXubVrrljm
//V0jt+WS9bqM5KJn2C5zWZbk/Pp/mz+AH/DSBH1EqG5AsWwbADtixvvf8Aour86jXCeyAHev6Tm1yxJ/h
//Gh83IhMSgBtwY5IbKhESSJbXCgj9BtyccU5QZ89NntMpsIEA7ICdlmcE1bfdgBtwc775QJ2Oo3c54Abc
//2J4NVO82JphBLgBmmp8LVH8Nh/6xzwgwA2YalQmQgUyAwA7YsT4TIPZMANyAG/szAWLPBMANuLE9EyDm
//TICMZAJgBsw0JxMg5kygKDPfll51Lw==
