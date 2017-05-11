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
      var x = new Int8Array(data.x_sab); x[0] = 0;
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
      if(id4_R_t2 == id5_R_t2) {
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
outputs[0] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtms1qwkAUhfd9iiwrCDFeM0KLC6WVLvoD2uIylKYLoWoXcVX67k1MrEm4Q01mRsbp2Q035sQZ8zH3
//HMf3N9vkc5v4vreMB9EsSvpXXnC9jMNi3EvHw/3Y91eb+P0j/fDdxBt5X5fLuB8toiTopnfTbtTpepd7
//paya69Srw1I1ZKtBqrZ6Xa6zer+kXK6TpD6Q6ISSevHcb2/8eOM9PLk3s139MJ8BWw3ZalmBWAViFaiu
//kK/ubDLdLW9lzX5XoZfdW1m4/WRKF4f8xUJ/Wvx6jLpMmNfM9eaLTC8f79b2bbOOR9Px/fy2c+Fz8PRK
//8ASAB/AYhochJJST1RSeKiYhCxXgATxnCg/Jdx5ldIjddwyBg5YN4FjSspEqOHzDRqcFJwA4AMcir1O6
//T5PTKT6tu1UDOADHJp9zDDjNXA7AATjOe5xjsGnicBShQZsGaOz3N+2bNDolNAgFAI1N3oa0exsy06IB
//HIBjk7ch7d4G4AAc570NafY2hDYN0LjubUizt9G402RjoQka06/L4amCfXWFREMoQ2N6Zk1e+CavtuKK
//1b6FYJ8n1Fo05qLQdNCmWhfN/vh8nr2AH/BjAz/UKBsQWs7amGInqLkcsAN2TLLTb+ByhJbDNuUq9hxw
//42DPRqrkyDo2Ajtgx+V+TZkc+jMmMM9NAG7AjVU5gcpBNZnTOeIAAdgBO2eeEbQ/q2aGG1k+AG7AjT35
//QPvDanw6gL0GzLifDah0aQRuwM2/zAXad2inZAZZGpixKxMgA5kAgR2w43wmQNozATKSCYAbcGNPJkCa
//MwHsNWDG/UyAtGcC4AbcuJ4JkOZM4FhmfgBS6nUU
