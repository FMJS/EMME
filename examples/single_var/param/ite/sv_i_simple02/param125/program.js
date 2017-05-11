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
      if(id6_R_t2 >= 2) {
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
outputs[1] = "id6_R_t2: 0;id8_R_t2: 2";
outputs[2] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmEtrg0AUhff9FbNMIDBxHk5pyCKhlS76ANOSpZTahdDELsyq9L9XHU0ncgcnRhoDdzccz9Xrnfk4
//IqXpLvvaZZSSJPajMMrYDZnOkvi6XlO6SeOPz9xwvyRz8j1KYhato8yb5BW8XI0n5EAVoCoNlYNeDnoF
//qOpeC1V3qlUvd2zekm2hM8Nt6tyiC4suLbpveW7Vzw9ZPN2Sx2ecmfvMGm/vg6rp5aCXg14BegXolaBX
//Nr16j8NlUG7ywYTrt8srp0X1qC5qXPTqmwTVQQFvAVfrytW6qNTrcqzv6TaeB4uH1d34iiLfyDfy3T/f
//+0l2pdvcCmQb2Ua2LyO79+PskNxVLbKNbCPbg8ttF7Lh1O6Ra4ZcI9fIdb+ZLU/IbIlsI9vI9kAzW3bO
//7BO5ZjnXauDf4uc6jX+jV5YzqgbL9blmxlro81vpgzlz3otGFwrsQoFdKLAL1cq1aHKt4Di3km0OXB33
//D+0lfEW0EW1E+9/RNtL8SLBZe2Q7Ys0Qa8Qase4Ta9EZa+GI9S8T7i9E
