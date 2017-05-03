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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 513";
outputs[7] = "id6_R_t2: 2;id7_R_t2: 513";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoXt7mRbUDxYpHhRoR56DEJ6CFjrIT1J/7tJ80GaTjTdbD6E91ZmZ5t0Ux6G
//l0i520df+0hKEQYzf+VH+lZM78Jgnn+WcrsLNh9xw9NC3Ivv6zDQ/tqP1CTeQcdPNxNxUvXYqilVie0l
//ttdjq+m9JtX0TtOqiju27+FnUtel7nKdaupeTd3U1Gc1183u5yAeXh7F8yvOrPmZVX79jK2We4ntJbbX
//Y3s9ttewvabamz7j1WJ5fMgnJ5z/unjnNNldt6iyxTm3qH9bpPzyy+wvxn4/vzvd+bZOdh6uJIeABgJA
//AAi4QkCdIVAc87R7ApirWsOA6QAwAIYOp4PiOFWfMFBrGDAxAAbA0A6Gs6GgLxY0+8DJ6bSggAJQAArD
//ZAl0tlgcuG6RJFTq2XdeOC0ABsAAGAbJF1yw0DhdsMYCUwSwABaDZw5usaCOsMBkASyAxcA5hB0VVimE
//k6nCKA0qQAWoGMubDsXBkrt0wljNEKABNICG0bz/cDkMtvmEwSQBLsDF/34rog0X1BEXmC7ABbgY4bsS
//TbBwkVHYThYEKkAFqOgxoyilli4TCo/lwnaCAAtgASz0l084ReGvdKItFZggQAWoGCqb6IgK6oQKTBWg
//AlQMk0u0hOKSVKI5Ez8fT17I
