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
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 <= 2) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
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
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlsFLwzAUxu/+FTluMMiWvBlQdtjQ4UWFquxYxHgobKuH7iT+77ZNK6m+Qm1T2OG7Pb6+L7wk/ZFP
//yvSUfZwyKUViL+MoztSVmF8n1tS1lIfUvu/zhruNWInPSWJVvIuzxSx36LKazkRDJVZdeqpmezXbS6y6
//yOvDa3IsdNWi6xadWvS29d25ON3VhWo81e+u9C+xfrgR9484M28/vqpZlVh1yaqd7+LXFIadwrBTGHaK
//xh1Hm215yY2J6ily57xwT2rTn4/VItvqR2GX4N3O+bQrnK4ut/+WHu3qOXq5nV5I4A28gXd4vH/Oty/c
///gWFQ1sBbaANtAehTUPRplHQxqsNtIH2iKHce9L/HckrL9AG2kD73AJ5F7D5OD4Ma4RxYA2sRwvjXbCm
//EbD2X2sFrIE1sA4bxGlAECegDbSB9nkGceodxClYEAfWwBpYBw3i1DuId8X6G6rDLfI=
