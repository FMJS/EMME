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
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 0.5000;
      var x = new Float32Array(data.x_sab); x[2] = 0.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 0.0078;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 1.0000";
outputs[3] = "id6_R_t3: 0.0078;id7_R_t3: 1.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmz1PwzAQhnd+RUaQEGni2EYgBiqEWAAJho4VUhkqUcrQToj/Tr5oXHp2+pn64+0U3cUvObt5uLN7
//cTydz77msziOxiMxfBnO2FXUu+jln+vxSC4Z4ngyHb1/5Lc+9KOb6Pt0PEqHg+EsOc/HsvLq7DzKrVlx
//nRZWXl5V1kq9sFaylTXJ75i8jT8Le6poqHamsWeKumrnGrvQ/N36eX6i26e76PHZx9j+PXtKRkTHKUgF
//VZeTupzU5aQuJ3WbWVV1G6uqK8l75f97qzV+6d+Xi7yk9jdr+cheMVrnTEzO1ORkJmdmcnKTU5icsnZK
//U5zSFKc0xSnpOOtpvq9fJfLJ6NHVyNdBPXKT1/ckBswAM8CsG5gdmFfEdDGbUSZalmwdwAFkABlAZlVW
//tsqqRXiZ3sX1LukGxNgBISYvATFALCSILcb19NlNonel7TnR3vgknEHXJguH7AvgArhszL5Eh2yT7hWQ
//ABvABrAFUFYuvgKZ3sX1LkfQpn7RATFADBBzpazckU/CGXTRCwdwAVwAl6dlZRi5V/dgw0Y/wAawdVhW
//brSvvw71HDytBNqANqDNkzNM3/fJ2hcOOAPOgDMXMzXeIfG8Odk8wo5bEgTuSnsTUSgQbCJS1RsrJ63C
//NGellZG6jNRlpC4jdbcDsRGuaHlazV2lPneV+txVUiTfuNUpVf83tTY6rb6ywBqwBqyh+ckCqLU1PdGo
//A9KANCDNqUytgzYoq3DGDoSzpX024Aw4CxRnvjZEHQViW2yXIiMDwoAwyzOy47ZGWVteAnFAHBAXZNG5
//9x9/WAU5+sQTOAPOgDPXis4u26UsKjqBMCAMCAum6PQ7H+sWcTgaAOKAuBBaqKw96QTkADlAztvzT1/3
//03bvKgDYADaAzY3s7bhtVY6diu4LfL/UxLX5
