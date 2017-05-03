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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[1] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 768;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[7] = "id6_R_t2: 768;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0c2ZSUVxYpLhRoS66DEJcBKx1ka6k727SpCFNTzSdTNKL/66cOZPLpHxk
//fiLlYhl/LWMpRRT6wTSI1Y0Y3kbhaPNbyvkifP9IGh7H4k58X0ahCmZB7A2SGbT+dTUQW1XNVk2pSmwv
//sb2arWbXmlazK82qXtIxf4s+07oqdZfrVFPXNXVTU/drzptfz0rcPz+IpxesWfM1q9y9z1bLvcT2Etur
//2V7N9hq211R7s2c8HU/WD3lrhTd3l8wcprPrBr18cMQNqt8GaXP6Sf4XY4/Pz85mvs7SmasLCQSAABDo
//FAFvB4FimYfdE8Cc1RqGkX8NGkADaOju/aBYTq9PGgg0gAbQcHAadl4M+oJBsQ+8PQvlrYQCCkABKBwm
//T6CdwWLBVYs0oVLPjwkYAANgOIWMwQULjRMGayy2NxfgAlyAi4PkDm65IHABLsDFuWYRdlhYJRFOtiHG
//AxWgAlQczRcPxcKSu4TCgAbQABpO+zuI/WGwzSiM5aYDYAAMgHE0X0e0AYMABsAAGP/pm4kmXLjIKWw3
//IxpUgApQ0WNOUUouXaYUmuUCLIAFsHD8GYVTFP5KKNpSUd1uAAtgASz6yyc6woKABbAAFmeVTbSkYp9k
//ojkUPyrMYmg=
