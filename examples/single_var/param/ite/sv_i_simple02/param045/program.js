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
      if(id6_R_t2 >= 0) {
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
//eNrtlj9rwzAQxfd+Co0JBJRIlwpaMjS0oUtbcFsymhJlMDRxB2cq+e6xLbvI7Rlc/wEPbzue74mT5B96
//Usan5OuUSCkiex0GYaJuxPw2sqaspTzEdv+ZNjyuxUp8TyKrwm2YLGapQ+fVdCYqKrHq0lM126vZXmLV
//RVofPqJjpqsaXdfoVKPXre/OxemuzlTjqX53oZ/F3fO9eHrBmXn78VXNqsSqS1ZtfBe/pjDsFIadwrBT
//VO44WG/yS65MVE6ROueZe1Ka/nwsFtkUPwq7BO92ztdt5nR1vv1dfLSrt+D9YXolObwV8AbewLsT3j/n
//2xZu/4KANtAG2mNBm7qiTYOg7YdyBbSBNtDuN5R7T/q/I3nh7eHVBtpAG2j3GsibgM3HcWANrIH1SMN4
//E6xpAKwRxIE1sB4wiFOHIE54sYE20B5nEKfWQRxYA2tgPdIgTq2DeFOsL5AuLf4=
