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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[1]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[1] = "id6_R_t3: 2;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 514;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 131074;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 131586;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[9] = "id6_R_t3: 2;id7_R_t3: 2";
outputs[10] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[11] = "id6_R_t3: 514;id7_R_t3: 2";
outputs[12] = "id6_R_t3: 131072;id7_R_t3: 2";
outputs[13] = "id6_R_t3: 131074;id7_R_t3: 2";
outputs[14] = "id6_R_t3: 131584;id7_R_t3: 2";
outputs[15] = "id6_R_t3: 131586;id7_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmz1vwjAQhvf+ioythBQSx6Fq1aGoQl3aSnRgRJXogNSvAaaK/96EBDBgoBCfg+DZorN9kDjvwyvO
//F4bf49HPeBSGwXCQ9rv9kboJmrfDQWt2HYaf34P3j2zCYzu4C34vh4O43+uPoka2Qk2vrhpBFk3y6ziP
//6ulVES1y5tEiYxGNshmfb8OvPB4bOcy42hBPjOxmXG+Ipxs+t/w+k+D++SF4ejnFe5vGF3dkZl9EtTWa
//WjOYeZU1r7LmVda8ypp38axTa9Scq61z9ercYo+77c50k5d2bvbUspXNfPWmwWjbYLxtUJWDrW0rW/aV
//5RfvlC+nNb99dbHytZevnFyENpnHyByZn5/Mqyt5MTjf+Ka8yC2ferD0dYT4ET+/8ZXEP9/gyKf4lQPx
//J4gf8Z+f+Kv+uNctffNlcwsE3ABAwA1UosX8kXhFgrkRuAHEj/hrcAP1SN/uBqoDIVJRs4UhgAkYgj3+
//OFwHxvzmY59U0G70jydA/9QGKniCetRv9wROmKCvYQJMwBPsXRWomwlKkgkpTIAJ58eEasWC43QJCu8A
//J+BEnd5h7Y/EukmRWF9NvANMgAlevMPREWF31cElJ8xOhBhEgAhsg1QnwvqgAZjD+xBW4mXOPbsTkD7S
//pwIh1J3gQvj/7k04GAfLZxQBAkDACwh1LLgFghIDQgIQAALnFqW7GOT8gQ9I4BqABK7BQ2eDW0zsOMaM
//awAIAOGYux18uAYpSKx1QMAJOIFxEOqAcEsKLckEvANMoCYh3hXhwzsIcmL5tCOcgBN4B5FOCblChSdO
//pHACTnACUrZ7wnf9Ao8BO2DHqXRUyJU18BhwAk6cRpeF72qHS3b8AXTar3s=
