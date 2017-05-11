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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
outputs[0] = "id6_R_t3: 0";
outputs[1] = "id6_R_t3: 2";
outputs[2] = "id6_R_t3: 512";
outputs[3] = "id6_R_t3: 514";
outputs[4] = "id6_R_t3: 256";
outputs[5] = "id6_R_t3: 258";
outputs[6] = "id6_R_t3: 65536";
outputs[7] = "id6_R_t3: 65538";
outputs[8] = "id6_R_t3: 66048";
outputs[9] = "id6_R_t3: 66050";
outputs[10] = "id6_R_t3: 65792";
outputs[11] = "id6_R_t3: 65794";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmb1qwzAUhfc+hcYEArIky/2BDA0ldGkL6ZDRFNzB0DQZnKnk3WvZiS0S2Uiy3FA4mzi6upGl71zj
//G0q3+2K3LygleZakq7QQDySidLPNPr9K8XlB5uRnkmc8XacFm5VRohpNZ6RUYzXmSpXVqFZZOd585N9K
//51q0rosOPe7I05W/3vP0QB5fn8jL2//YbaW3e9SztKo0qnoGYcwgjBmEMUN7Iroqz9X6dFeLZXW8k5Ou
//Ik5PV66M1OquSdY3yfsmm59fHi/XEFVHvK9VxOGGmqDmgBpQu0M9hNvzyeYiIgukq01frLUAXTKgDtRD
//129H1JsDZ+6oCwfUY6AO1N1R9y/cIUHXr9AHfy4T4A/8r1vpmwfyMMBxrRXqd0AdqF+z0g8B3Vzp7fFP
//pBSo9TDAn3ZlLt3RbJ27W0A6wY5qD9hDd2ucqv0Q1M3V3sEASRTDADBA6Grf26YJaQAx3AASf0LBAB4G
//8G3ejF//B5tC3t6jsw9TjP9W0L50Q9pCPwpfA6DfDwOM/VYYCf/eHpCFKX4BlHZ0cg==
