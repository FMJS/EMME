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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[1] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[3] = "id6_R_t2: 256;id7_R_t2: 3";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 259";
outputs[7] = "id6_R_t2: 256;id7_R_t2: 259";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2s1Og0AUBeC9TzFLTZoMzGVo1LiwMY0bNamLLokJLkisdUFXpu8uFEoovSgdBkrr2TV37vAzNF+Y
//E6RcruKvVSyliEI/mAWxuhHObRSOt7+lXCzD94+k4XEi7sT3ZRSqYB7E7iiZQZtfVyOxU/XYqi5Vie0l
//ttdjq9m1ptXsSrOqm3Qs3qLPtK5K3eU61dS9mrquqfs1582vZy3unx/E0wvWrPmaVe7eZ6vlXmJ7ie31
//2F6P7dVsr672Zs94NpluHvLOCm/vLpnppLPrBt18cMwNqt8GaXv6af4XY4/Pz85mvs7TmesLCQSAABDo
//FAF3D4FimZ3uCWDOagyD0j5oAA2gobv3g2I53T5pINAAGkDD0WnYezHoCwbFPvD2LJS3EgQUgAJQOE6e
//QHuDxYKrFmlCpZ4fEzAABsBwChmDDRYaJwzGWOxuLsAFuAAXR8kd7HJB4AJcgItzzSLMsDBKIqxsQxI2
//QAWoABVD+eKhWFiyl1Bo0AAaQMNpfwdxOAymGYU23HQADIABMAbzdUQbMAhgAAyA8Z++mWjChY2cwnQz
//cg0qQAWo6DGnKCWXNlMKj+UCLIAFsDD8jMIqCn8lFG2pqG43gAWwABb95RMdYUHAAlgAi7PKJlpScUgy
//0RyKHyPcYlg=
