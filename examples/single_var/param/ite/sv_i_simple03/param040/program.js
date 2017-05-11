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
      if(id4_R_t2 >= id5_R_t2) {
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 1";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 1";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 2";
outputs[7] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[8] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 2";
outputs[9] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[10] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 0";
outputs[11] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 0";
outputs[12] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[13] = "id4_R_t2: 2;id5_R_t2: 1;id6_R_t2: 0";
outputs[14] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[15] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[16] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 1";
outputs[17] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 1";
outputs[18] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
outputs[19] = "id4_R_t2: 2;id5_R_t2: 1;id6_R_t2: 1";
outputs[20] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 1";
outputs[21] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[22] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 2";
outputs[23] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 2";
outputs[24] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 2";
outputs[25] = "id4_R_t2: 2;id5_R_t2: 1;id6_R_t2: 2";
outputs[26] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1PwkAQBuC7v6JHSEhKd6AkGg4SJR78SEDDkRjrgUTAA5yM/90WihTY1dLO0NG8t2ZqB7r2yY6v
//9f35cvG+XPi+N4la48F4Yc695sUkaqfHQXzc2dR9fzqPXt/iH77peV3vozaJzHg0XgSN+GpaHdUbXm3T
//Kamu++xXO5lq21oN4m7T58ksqZtM52ydHPWWo0/bUU8/99O7vL/y7h7+352t6tv7aVmrbWs124GsHcja
//gfY7rFd30OuvlndnzTbfOL6ymVy9s3TfS7Q51bFfl/bvp789a3d7Y3vPdb/hKOm3Pl6t7ct8FnX7l7fD
//6/qZ/xseAzzAUyUeksJDMngC4AGeE+I52FwY6WRXWByOa2QLAAdwFI1smVNMA1ta5R7XAAdwNI1rZeCQ
//BJwAcABH/aiWh80xgxrjbpMd0wzQAI2iMY3YxzSSGdMAB3A0jWnEPqaRzJgGOICjZ0wj5jGNcbdJjkOm
//GFr6cdl+amh9dENHj7A0Guk7O+aBP+bRLrlie98itH5eWG63sZwMmf6Ls1sPj4ujHwdPeTYd+IEfaT8/
//bDoMeuwbj5QdAzuwc0I7JGqHTmon2IvXYAd2Ktp3Dk7x7DrZqsyeAzdwU+GeU9oNVeTGwA3cVOeGZNyQ
//iBtXvhbADdyoytfKvHbj+isnxzsEBbI12IEdTdla8TdvZNwYuIGbP5Cr5XFDJ3TjytTgBm70ZGrFdxt7
//MsC318AMzOjM04rvNNJmDMzAjMosrbgZEjDjytEMzMCMqhyNBHI0EsnRYAd2NOVoxJ6jkUiOBjdwoylH
//I/YcjURyNLiBGz05GjHnaCSSo8EMzOjJ0Yg5RyORHA1mYEZPjkbMOVpeM18iA3So
