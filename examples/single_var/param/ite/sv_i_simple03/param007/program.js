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
      var x = new Int8Array(data.x_sab); x[0] = 0;
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
      if(id4_R_t2 < id5_R_t2) {
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[7] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm0tvgkAUhff9FSw1MUG8MiZtXGha00UfibZxSZrSBUnVLnDV9L+Xl3XUIQHm0RHPbnKRO3CZL2fu
//EVx3s42/trHrOlE4DOZBPLh2+jdR6HPj0W7suqtN+PGZ/Ph+6oyd704UDoJlEHu95GzKRt2e09llSqN5
//nuPoiIv6wqiXZFu9Res0PuAy83EqiQ9L8vgl8WLeH2fydOs8PrfvzrL4/n6GwqgvjPIZSJiBhBnoOENe
//3fl0lpX3oGa7K07O7KdnH5ROcHAkPljMMCuenzB/WWpx1jzjYplmzMdZfd8363A8mzws7rpXrgggDwAB
//IIMA/VVBCz58jQ3AA/UBPCbhIa3wkFl4eOXxAA/g+T/lOTmkRnf4KFQH4LSx5yFZdMo6HtIDD/odwGOJ
//6pAe1SGoDsBpda8jDQ7ZAI4HcACOVRY1p1XKDOoip+rtGuABPDbZ01XQqWdOS4ID1QE452BNVwGHTIJT
//ZksDHIBjjy3dXG/EpjTUBtBcgCUt0+GQDnDQ3wAc++3o5mpDUBtAc5lWdPPOxig0+P8G0NhlQ5MGG5r0
//bNMAD+CxyYYm5TY0QXUATvttaFJuQ5MeGxrgABx7bGhSbENDbQDNBdjQpNyGRn8DcFpvQ5NiGxpqA2ha
//b0OTYhtaITSp6jBF0OheLvtZmXDpspIcTBoa3XdWZ8HXWdqSFTu6Ciacj8lt0U5kiCn6eI1/TqzepwQv
//81ewA3ZsYIdqeAJMySc4ZrnxwA24sUhzZN5OE5NT4Z0BcANuzlpvmr9nY5IZ7NHAjE1aQ8q1hsANuGm5
//1pBiranKzC/xTHb6
