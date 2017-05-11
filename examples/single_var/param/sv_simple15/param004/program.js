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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
outputs[1] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[5] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[6] = "id6_R_t3: 65536;id7_R_t3: 1";
outputs[7] = "id6_R_t3: 65792;id7_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2zFvgkAUwPG9n4KxTUwQzsO0TYeaxnRpm9jB0TShA0mtHXBq+t0LgnDqIaVyh5r/Rt5xT+HwlxeP
//57qLZfy1jF3XicJgNpnF4sbp30bhcH3suvNF+P6RnPA4cu6c78so9GfTWez1khlidXTVc5LoID3206hc
//HWXRLGcazTJmUS85Y/4WfaZxX8mhxkVFfKBkV+OyIh5UfG7+fX6c++cH5+nlHK9tFS+vSM1eRqU2Gmgz
//qHmFNq/Q5hXavEKbt7zXgTaqniu158rtc7M1nozGq0XeWLn1XUtm9tPZVYPevkF/36DIB4f7Zg71M/Mv
//Ps4fTm1+/exs5us0n9nkB3HhggIogEJLv/tysFj4vnkSNJ/aGApAAARAaFIlNAShWGDPJggCEAABENoC
//4dAioGsO1IfNPBK+DGACJqgbDjGkuCVWoVAXAhIgARKOpnLoBgR95WCKiUBKARRAQe3Q4B/KXUWKi/dt
//UiFBARRAwdrORKPqoRsS9NUDUAAFUNirHv6wKdE1FAIogAIozENx2GbFcdYTtvEYXvvgAR5UGU23MLrm
//Y6B9NIECKICiuyrj6Jio3/Mwj4f6opUHHMBBhWGqP2N3UGHn/90ZW/E8Z33PBiAAAiB015vRBgd/7syo
//RwIO4AAOuuvMaJcDAQdwAAen2pdhrjYwT8TmK9ggARLUDIa6MtplouZla0AABEA45p4MG1WDKSS2X5WC
//CZigbjDUkdEuFBISIAESTrkfw0blABMwARMn3Y1hbo8CJmACJs6iF8P23oUNOjZfsIYO6KDCMNKJYW5H
//AyZgAibOog/D9j5Hm3T8Aja4Dxg=
