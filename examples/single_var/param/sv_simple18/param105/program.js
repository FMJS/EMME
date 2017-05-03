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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2j1rwzAQBuC9v0JjCwFFOimBlg4NJXRpC+mQ0RTcwdA0HZyp5L/Xjh1jJ+fWkeWP4d3C6RTbcngI
//Lyfldhd/72IpRRTOglUQ61sxvYvC+fGzlJtt+PGZNDwtxL34uY5CHayDWE2SHXT4dDMRlaphq7ZUJbaX
//2F7DVrN7TavZnWZVlXRs3qOvtK5L3eU61dRNTd3W1Gc1183vZy8eXh7F8yvOrPmZnTz9jK2We4ntJbbX
//sL2G7bVsrz3tzd7xarE8vOTKCR+fLtk5TXfXLap8cc4t6r8W6Xj5Zf4TY7+f353tfFunO/dXkkNAAwEg
//AAR8IaDOECiOedo9AcxVnWGwCjSABtDQ4f+D4jhVnzSQBxoMaAANoKEVDWd/DPqCQbMvvD0L5TxBAQWg
//ABSGyRPobLE4cN0iTTip5995YcYAGAADYBgkY/DBQuOEwRmLau4ALsAFuBgkd/DLBXXGhQEX4AJcDJtF
//uGHhlEQ4U4F5B0ABKEY571AcLPnLJ6xTPgEYAANgGMkMxOUsuOYT1jGfABfgAlyMZC6iDRfUGReYlQAX
//4GJ0sxJNsPCRT1infAJBJqAAFH3mE6W80mc6YVgsLGYngAJQGHk24ZWE/5KJtlBgbgJUgIqhcomOqKCO
//qMDMBKgAFUNkEi2huCSRaM7ELzDTXsg=
