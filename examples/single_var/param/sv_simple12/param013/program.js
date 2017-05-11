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
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      var x = new Float32Array(data.x_sab); x[2] = 1.0000;
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
//eNrtmz1PwzAQhnd+RUaQEGni2EYgBiqEWAAJBsYKKQyVKGVIJ8R/J180Lj07FJrEdt5O0V185Ozm4T27
//F4bLVfa+ysIwmKdi9jDL2FkwOZnkn/N5KjcMYbhYpi+v+a030+Ai+Dicp/HsaZZFx/lYVl4dHQe5NSmu
//48LKy6vKWkUvrFXYyhrldyye52+FPVZiqHamsSdKdNXONXah+bv183wGl3dXwe29j7n9ePaYzIjOU5AR
//1LicjMvJuJyMy8m4zayqcRurGleS98qf91Zr/DC9Lhd5I9r3rOUjJ8VonTMyOWOTk5mcicnJTU5hcsra
//KU15SlOe0pSnpPOsp/m6fpXIJ6NHVyMfn+qRu7y+ByFgBpgBZv3ArGNeEdPFbEaZaFmy3wAOIAPIADKr
//VNk2q9bpJXoX17ukGxBjHUJMngJigNiYILYeN9Grm0jvits10d74JJxB1y4LB/UFcAFcNqov0SPbpHsF
//JMAGsAFsIygr11+BRO/iepcjaFO/6CgrATFAzJWy8p98Es6gi164LsEF9QVwQX0NWFaOQ3v1DzYoMoAN
//YOuxrNxpX/831HPwtBJoA9qANk/OMH3fJ2tfOOAMOAPOXFRqvEfieXOyOcCOWzQK3JX2JqOxQLDJSI3e
//WDlpFaY5K62MjMvIuIyMy8i4fwOxEa5oedrWrlKvXaVeu0qK5Du3OsXq/6bWRqftVxZYA9aANTQ/WQC1
//tqYnGnVAGpAGpDml1Hpog7IKZ6wjnG3sswFnwNlIceZrQ9QgEPvDdikUGRAGhFmuyIZtjbK2vATigDgg
//bpRF595//GEV5OgTTxSdwBlw5lrR2We7lEVFZ1cIgyIDwoAw/xunHCg6odKAOCDO26KzhxYqa086ATlA
//DpDz9vzT1/20/3cVAGwAG8Dmhnobtq3KsVPRfYHvC8lfthc=
