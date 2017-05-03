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
      var x = new Int16Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
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
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk9LwzAYxu9+ihwVCmm62ILiwSHDiwrzsOMQ6qHgnIfuJPvupqZ/siRlXZvVRp5beJL3TZr0/ZU+
//hNLtLv/a5ZSSLI3Wy3XObkh4m6XXRTsSbUo32/T9Qwx4nJM78n1ZjQtExGy9Eq2rgByoXFHlCF2V2Qs1
//LtRIVxNFlSN0lYn25i37DOp1m7q6OlXnLbqc39TjlnnL9ezJ/fMDeXrB7th2R3t6NUujxtaxaoZmp9QM
//jRpbx6oZuDUDt2bgegZ5xsv54veQD1ZZPbOIDIvotk5WdjbnaIm0drJq+oXxiimj7NEy8nVVRO4vKMod
//5Y5yd1TuzCj3Oml4/mK3bycQAAQAAX/4xa8XwMZEQAIEAAFAwGgIMD70YwHg+Kah/FH+KH8P/vnNzvp4
//wgF//Jpe5gQCgAAgYFo+gAsAdHYBgAVgAVjwwRtwi4UEWAAWgAXf/YJ+UOjlFgAJQAKQ4Ou9gfoYmDsP
//gQMBQAAQ4MddgtMB0NdDABaABWDBk/sFQ7CQAAvAArDw/+4cdIGCCw8BSAASgIQpeQiKe+jSQZhZXyWU
//P8of5T8d/8Bp8R9zD4AEIAFImLp3cCYkJEACkAAkeOgbDATCKa5Bdxz8ABIW9B0=
