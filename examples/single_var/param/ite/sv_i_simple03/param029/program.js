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
      var x = new Int8Array(data.x_sab); x[0] = 1;
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
      if(id4_R_t2 <= id5_R_t2) {
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
outputs[0] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 2";
outputs[6] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[8] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 1";
outputs[9] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[10] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[11] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[12] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 0";
outputs[13] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[14] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[15] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[16] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
outputs[17] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
outputs[18] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 2";
outputs[19] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 2";
outputs[20] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 2";
outputs[21] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[22] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 1";
outputs[23] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 1";
outputs[24] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 1";
outputs[25] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
outputs[26] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1PwkAQBuC7v6JHSEja7tCSaDhAlHjwIwENR2KsBxIBD3Ay/ncpLbKUrfZjp0zMe2sWOrVLn8z4
//pq672qw/NmvXdeZRdzaerdWlo67mUZAee9vj3v7YdRer6O19++XbodN3PlvzSM2ms7Xf2Z5Nu6N2x2nt
//K8WrSZ3sak9bDYyr/rba4mW+jNeVVllfp5z1bk6dIGc9ve6XM3i4du4f/9+d7dYP99M1rgbGVb0CGSuQ
//sQJlKyS7Ox6Odtt7tGc/u+DF5x5t3P5mtA975g/T+qP01zNUzytsrpnUm0zjesnxbm9fV8uoPxrcTW7a
//F64Jjw88wNMgHmLFQ83i0TuPDzzAc77Oc+LKTt/R95cJjt51FOAAjqCRTTvP0sCWftv2uAY4gCNpXCsC
//h5qEkzeqAQ7gyBnVqvcb86BmEY3ebXygARpBYxpZH9OIZ0wDHMCRNKaR9TGNeMY0wAEcOWMaWR7TaqLx
//Mt0mtBRDcz8uh6uGxkc3zKkR1kbDfWdlHvgyj3bNHcv8FaHxeuGfaAwt5dd+E5aMoo97S17PCcvF0U/j
//5yJ+FPzAzzn9nHQkW3r038meHQU7sNOgnV8GttpyzCMbjxsfbuCmQTfE6IYadONlAgK4gZuzzWrENasR
//e8+BHdg5Y88hnp5D7D1Hz9cU3MCNqHytyPsDZdO1Au8QVMjWYAd2JGVrdeSY/9Op50bBDdyIz9Wqv6/G
//YcaHGZgRn6lVfzWaw0xengYzMCMpT6sznxFzr4EbuJGZpVXvNcTca/QczYcZmBGVoxFDjkYsORrswI6k
//HI2s52jEkqPBDdzIydHIco5GLDkazMCMnByNLOdoxJKjwQzMSMrRyHqORiw5GtzAjZwcjSznaEXNfAMs
//3nSo
