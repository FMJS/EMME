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
      var x = new Int8Array(data.x_sab); x[1] = 0;
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQRG54wGWrpoKKGbtpAuspSCXQhN04VZlbx7NV4wemyNjqnafydnzngZ5UN+
//RsrtLvzchVKKwHe9lReqa2HdBP48O5Zys/Xf3qOGh4W4FV+Xga+8tRfas2gGHY6uZuKoqtmqU6gS20ts
//r2aryb3G1eROk6oddWxeg4+4rgrdxTrV1HVN3ampuzXXTe9nL+6e7sXjM9as+ZqVnt5lq8VeYnuJ7dVs
//r2Z7HbbXKfcm73i1WB5e8tEKZ08XzbTi2XWDdjo45wbVT4OUXX6ZfmLs+fnZycyXdTxzfyGBABAAAr0i
//YFcQyJfZ6p8A5qqAATAAhiH+HeTLaZ8TBgIMgAEw/DEMlZ+Cc7Gg2BcOFIACUJhElkCVwXzBVYckoVRP
//zwkYAANgGEO+YIKFxukCsAAWwGK8mYNZLAhYAAtgMc0coh0VrVIIQAEoAMW09jnkC0vmsgkHMAAGwDDm
//vQ+ns9A2mwAWwAJYjHo/RBcsCFgAC2DxX/ZINKHCRDYBKAAFoBh+NlHIKk0mE5rFAigABaAw9FzCKAm/
//pRKAAlAAinFmEj1BQYACUACKyeQRHZk4JY1ojsQ31f5bcA==
