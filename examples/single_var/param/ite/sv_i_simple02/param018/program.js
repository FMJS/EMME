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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 > 0) {
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[2] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmM9rgzAUx+/7K3JsoZDGJGas9NCyyQ77AXajRxlzB2GtO9jT2P8+Ndql8oKpldXCu4Wv36fPl3z4
//ipSmu+xrl1FKktiPwijzbsh0lsTX9ZrSTRp/fOaG+yWZk+9REnvROsrYJK/g5Wo8IQeqAFVpqBz0ctAr
//QFX3Wqi6U62y3LF5S7aF7hluU+cWXVh0adF9y3Orfn7I4umWPD7jzNxn1nh7H1RNLwe9HPQK0CtArwS9
//sunVexwug3KTDyZcv11eOS2qR3VR4yKrbxJUBwW8BVytK1frolKvy7G+p9t4HiweVnfjK4p8I9/Id/98
//7yfZlW5zK5BtZBvZvozs3o+zQ3JXtcg2so1sDy63XciGU7tHrhlyjVwj1/1mtjwhsyWyjWwj2wPNbNk5
//s0/kmuVcq4F/i5/rNP6NXlnOqBos1+eamddCn99KH8yZ8140ulBgFwrsQoFdqFauRZNrBce5lWxz4Oq4
//f2gv4SuijWgj2v+OtpHmR4LttUe2I9YMsUasEes+sRadsRaOWP8C1wQvPg==
