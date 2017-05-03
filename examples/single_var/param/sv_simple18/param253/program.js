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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 771;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 771;id7_R_t2: 3";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2jFrg0AUB/C9n+LGFgKnPk9LS4eGErq0hXTIKAUzCE3TwUwl370ajWjybPXujA7/Lbx7F/UMP8Kf
//J+V2l37vUilFEgfRMkq9O+HcJ3F4/CzlZhuvP7OG57l4ED/XSexFqyh1Z9kOOny6mYlG1WerqlYltpfY
//Xp+tFveaV4s7Lapu1rH5SL7yulfrrteppe631FVLPWi5bnk/e/H4+iRe3nBm3c/s5OkDtlrvJbaX2F6f
//7fXZXsX2qtPe4h0v54vDS26c8PHpsp1Ovrtt0S0XQ27R+2uRjpdflD8x9vv53cXO91W+c38lOQQICAAB
//IGALAfcMgeqYneEJYK6qDUMY3IIG0AAahvt/UB2ne0kayJyG0AUNoAE0GNFw9sfgUjB47As3Z6GeJxBQ
//AApAYZw8gc4WqwP3DNKEk3r5nT0zBsAAGADDKBmDDRY6JwzaWDRzB3ABLsDFKLmDXS5oKC4aWQS4ABfg
//YoQsQg8LrSRCmwrMOwAKQDHJeYfqYMlePqG08gnAABgAw0RmIPqzoJtPKM18AlyAC3AxkbkIEy5oKC4w
//KwEuwMX0ZiW6YGEjn1Ba+QSCTEABKC6ZT9TySpvphM9ioTA7ARSAwsSzCask/JdMmEKBuQlQASrGyiUG
//ooKGoQIzE6ACVIySSRhC0SeR6M7EL3CcXyQ=
