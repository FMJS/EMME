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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t2 = Atomics.load(x, 0); report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = Atomics.load(x, 1); report.push("id7_R_t2: "+id7_R_t2);
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
outputs[4] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[5] = "id6_R_t2: 258;id7_R_t2: 0";
outputs[6] = "id6_R_t2: 65536;id7_R_t2: 0";
outputs[7] = "id6_R_t2: 65538;id7_R_t2: 0";
outputs[8] = "id6_R_t2: 66048;id7_R_t2: 0";
outputs[9] = "id6_R_t2: 66050;id7_R_t2: 0";
outputs[10] = "id6_R_t2: 65792;id7_R_t2: 0";
outputs[11] = "id6_R_t2: 65794;id7_R_t2: 0";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 1";
outputs[15] = "id6_R_t2: 514;id7_R_t2: 1";
outputs[16] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[17] = "id6_R_t2: 258;id7_R_t2: 1";
outputs[18] = "id6_R_t2: 65536;id7_R_t2: 1";
outputs[19] = "id6_R_t2: 65538;id7_R_t2: 1";
outputs[20] = "id6_R_t2: 66048;id7_R_t2: 1";
outputs[21] = "id6_R_t2: 66050;id7_R_t2: 1";
outputs[22] = "id6_R_t2: 65792;id7_R_t2: 1";
outputs[23] = "id6_R_t2: 65794;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt27FPwkAUx/Hdv6KjJialvbuCGgeNMS5qogMjMcGBRNQBJ+P/brEF2/KKRXrXXvLdzOs7KC1+8sj1
//F4ZvH4v3j0UYBrNpMnmYLOLTYHA2mw5Xf4fh/G36/JI23FwG58Hn4WwaT8aTRXScrlA/fx0dB6WqFqum
//UFVirxJ7tVjNznVZzc40q0Zpx/xp9rqsx4XuYl3V1HVN3dTUk5r3zc/nK7i4uwpu77lmza9Z5dMnYrXY
//q8ReJfZqsVeLvUbsNdXe7B4/XF7/3OTSFV59unTlYLm67mC07WC87aDKDw63rRzKK/MTv86/nOLry6uz
//lY/jfOUu/xAHoYRNDDZgAzZtYbO/J78H1zdoYJ8a4V13Bmg7NCaCGqiBGjdzzY7UrG9E5JIaZY0aDTVQ
//AzVtUbPv4NI1NLH4FbLFT2wS+IEf+OnjpKM7AUhbo2YENVADNf2bdHSPJh1b/CTGKGYdAAKgHuxWbeq0
//vrCxS4KMRWyYdsAGbNzsVu007XRDjTztWAMoGWgAAiAAcjPtNNim6hog5Rogw8OBAARArQG03+ZVP+cf
//xyiZ4QlP9oASKHU1Fem+saSdA8TzPgAEQN1MRdqPqcgtSsWfaREgARIg+Zbh2jxY4Oz/Ca5KPX/Nv3Nd
//DfJbQAM0QONZfqsNZhqnt/7Gp1F6C2iABmg8S2+1C42yBo0GGqABGl+zW/bmGfv4lJNb4AM+4ONZcqtd
//frQ1aEZAAzRA42tuy8WUYwufamoLfuAHfjxLbbULkLFIDZMO1ECNt5ktF5OONX4qiS34gR/48SqxZW/X
//ygk/hgcB4Qd+PM1rud7LcvGDrJzWgiRIgiSv0lr2drjc8MPzPfADP55mtVzve7VJ0jdFK2+m
