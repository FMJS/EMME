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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
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
outputs[1] = "id6_R_t3: 2;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 514;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 258;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 65538;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 66048;id7_R_t3: 0";
outputs[9] = "id6_R_t3: 66050;id7_R_t3: 0";
outputs[10] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[11] = "id6_R_t3: 65794;id7_R_t3: 0";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[13] = "id6_R_t3: 2;id7_R_t3: 1";
outputs[14] = "id6_R_t3: 512;id7_R_t3: 1";
outputs[15] = "id6_R_t3: 514;id7_R_t3: 1";
outputs[16] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[17] = "id6_R_t3: 258;id7_R_t3: 1";
outputs[18] = "id6_R_t3: 65536;id7_R_t3: 1";
outputs[19] = "id6_R_t3: 65538;id7_R_t3: 1";
outputs[20] = "id6_R_t3: 66048;id7_R_t3: 1";
outputs[21] = "id6_R_t3: 66050;id7_R_t3: 1";
outputs[22] = "id6_R_t3: 65792;id7_R_t3: 1";
outputs[23] = "id6_R_t3: 65794;id7_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2z9PwkAYx/HdV9FRE5PS3rX4Jw4SY1zURAdHYoIDiYhDmYzv3WIrtOUoBe6eI/G7ked6V0rhkx+5
//PmE4nWWfsywMg/EoHT4NM3UR9C7Ho/7f6zCcTEdv7/kBd4PgKvg6Ho/i4cswi07zGer31clpUKvqSlUZ
//q8WZ5tXiPEU1yo+YvI4/5vW4cnS1rtbU9Zp6Mq/Hq/V0zXnL9/MdXD/cBPeP/+eKG1dUXWVZTY3HVldQ
//xhWUcQVlXEEbV9DGFbRxhWJe89hltXaPnwa3vze5do/+Pp98Zm8+e91g1DYYtw2qcrDfNrNvnlm+8dvy
//y2lc3zy7mPn8Us7c5gdxFJqoiKECKqDClgbLwcUt7rmHwnDWrfloZyKJgAIogKJLptgSisWtjCShUM6g
//0EABFEBhJzT4ZiI2fgld4REnKXiAB3jYTxnaCx/aGRRnQAEUQGE7ZegDShmu8EiTRJEz4AM+9t4hWbVl
//cUGxJCDVj9E2FSQNqICK3TRoSRp+oDAnDWd8pD0NH/ABH12SRoetEd98KGk+Eh7lgg/4sLJhcpjZQ5iU
//pH/OkxyQAim7JRJ9aKhocT54vgM+4MPK5sphJhJZUqp/cCI4gRPSiGyvyupgBaPdO1Ua9XLNzf0rHfpU
//YAIm2IUR7VOxgUTnLpXNdHTqUoEJmCBNiHap2GVCOWNCwwRMwISfHhV3WcI9HfUOFeiADhKGaIeKXTy0
//MybOYAImYMJPf4pEwnBFR7M7BTzAg4wh2p1il48NG6d7QUHKAAqg8NSbIpEynOHR6EwBD/AgZQh2prjb
//KRHBI+GxLfAADy99KdL7JxJ/ZepdKYACKKQRwa4Ud7sqMnjwPAd4gIeXnhTpvRaboPwAyFCoWg==
