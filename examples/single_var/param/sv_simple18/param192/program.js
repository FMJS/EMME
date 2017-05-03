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
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 771;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 771;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 770";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 770";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 770";
outputs[15] = "id6_R_t2: 771;id7_R_t2: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rgzAYB/D7PkWOGxRSE6NjY4eVUXbZBt2hRxnYg7CuO9jT6HefVivRPm42iS+H/02ePPElyg/5
//E853+/R7n3LOkjiIVlEq7tj8PonD0zHn2128+cwanhfsgf1cJ7GI1lHqzbIZ8nh0M2O1qk9WlVaVZK8k
//e32yWtxrXi3utKh6Wcf2I/nK60Lr1uuype631FVLPWi5bnk/B/b4+sRe3rBm3des8fQBWdV7JdkryV6f
//7PXJXkX2qmZv8Y5Xi+XxJddW+PR02cx5Prtt0CsHQ2pQ/DUoT5dflp8YeX56djHzfZ3PPFxxCgEJBIAA
//EHCFgHeGQLXM8/4JIK5qDEMY3IIG0AAa+vs/qJbTG5IGaU9D6IEG0AAarGg4+zEYCgZBvnB7FvQ8QQAF
//oAAUxskT5NlgteDCIk1o1MtzXpgxAAbAABhGyRhcsNA5YTDGop47gAtwAS5GyR3cciH74qKWRYALcAEu
//RsgizLAwSiKMqdDziewvA1SAClAxlR0P1cJKdwmFMkooQANoAA2T2QdxOQymGYUyzCgABsAAGJPZHWED
//huwLjFpKATAABsCYyJ6JLly4yCmUWU4RYnsVqAAVQ+YUWnLpMqXwSS4MMwqwABbAwoAZhVMU/ksobKlo
//5BPAAlgAiwHziZ6wkP1gUc8mgAWwABaDZROWVFySTHSH4hdNs2Kg
