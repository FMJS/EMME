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
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 514;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 258";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 258";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 258";
outputs[15] = "id6_R_t2: 514;id7_R_t2: 258";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0c2ZSUVxYpLhRoS5cBiEuAta6SFfSdzdp0pCkJ5pOJpfFvwtnzuQyCR/h
//Z6Tc7uLvXSyliEI/WAexuhHz2yhcHI+l3GzDj8+k4XEp7sTPZRSq4C2IvVkygw5HVzNRqWq2akpVYnuJ
//7dVsNbvXtJrdaVb1ko7Ne/SV1lWpu1ynhrpuqJuGut9w3fx+9uL++UE8vWDN2q9Z7el9tlruJbaX2F7N
//9mq217C9pt6bveP1cnV4yZUVPj5dMnOezm4a9PLBBTeo/hqk4+VX+SfGnp+fnc18fUtn7i8kh4ACAkAA
//CLhCwDtBoFjmef8EMFe1hsF4oAE0gIYe/w+K5fSGpIEc0KBBA2gADZ1oOPkxGAoGxb7w7iyU8wQFFIAC
//UBgnT6CTwWLBVYc0oVbPz3lmxgAYAANgGCVjcMFC64TBGotq7gAuwAW4GCV3cMsF9caFBhfgAlyMm0XY
//YWGVRFhTUcknjA8qQAWomMqOh2JhyV1CYewSCtAAGkDDVPZBnA+DbUZhbDMKgAEwAMZUdkd0AYN6A0MD
//DIABMKa3Z6INFy5yCmOZU1yDClABKgbMKUrJpcuUQrNc2GYUYAEsgIXhMgqnKPyXUHSlop5PAAtgASyG
//yyd6woJ6wkIDC2ABLEbJJjpScU4y0R6KX4REYjg=
