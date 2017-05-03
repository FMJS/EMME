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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 257;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 770";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 770";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 770";
outputs[15] = "id6_R_t2: 257;id7_R_t2: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYBiybJKS4eGErq0hXTIaArOYGiaDs5U8u614wuKc9w6snwZ/s0cHfkimw/z
//I853++R7n3DO4igIV2Ei7tj8Po50ecz5dhdtPtOG5wV7YD/XcSTCdZh4s3SGPB7dzNhJ1SeryqhKsleS
//vT5Zze81q+Z3mle9tGP7EX9ldWF0m3XZUPcb6qqhHjRct7ifA3t8fWIvb1iz9mtWe/qArJq9kuyVZK9P
//9vpkryJ7Vb03f8erxfL4kk9WuHy6dOY8m9006BWDmhoUfw3K8vLL4hMjz0/Pzme+r7OZhytOIeABASAA
//BFwh4J0hUC3zvH8CiKtawyBUABpAA2jo7/+gWk5vSBqkAxo0aAANoKETDWc/BkPBIMgX3p0FM08QQAEo
//AIVx8gR5NlgtuOiQJtTqxTkvzBgAA2AADKNkDC5YaJ0wWGNxmjuAC3ABLkbJHdxyIXvjQoMLcAEuxs0i
//7LCwSiKsqTDzCR3cggpQASqmsuOhWljpLqFQVgkFaAANoGEy+yAuh8E2o1CWGQXAABgAYzK7I7qAIXsD
//QwMMgAEwprdnog0XLnIKZZdTaGyvAhWgYsicwkguXaYUPsmFZUYBFsACWBgwo3CKwn8JRVcqavkEsAAW
//wGLAfKInLGRPWGhgASyAxSjZREcqLkkm2kPxC4nNYnQ=
