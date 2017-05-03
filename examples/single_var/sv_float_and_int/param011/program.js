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
      for(i = 0; i <= 3; i++){
         var x = new Int8Array(data.x_sab); x[3] = 80.0+i;
      }
      var x = new Int32Array(data.x_sab); id3_R_t1 = x[0]; report.push("id3_R_t1: "+id3_R_t1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2.toFixed(4));
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
outputs[0] = "id3_R_t1: 1392508928;id4_R_t2: 0.0000";
outputs[1] = "id3_R_t1: 1392508928;id4_R_t2: 8589934592.0000";
outputs[2] = "id3_R_t1: 1392508928;id4_R_t2: 34359738368.0000";
outputs[3] = "id3_R_t1: 1392508928;id4_R_t2: 137438953472.0000";
outputs[4] = "id3_R_t1: 1392508928;id4_R_t2: 549755813888.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlk9Lw0AQxe9+ij1aKG5mZtfstniwSPGiQj30GIR4CFjbQ3oSv7uxSUv+7AQtNOQwOYX3MrOTfcmP
//1Xq7z3f7XGuVpZSskhxmCsijjZxHN89S8yviTEU3UXFpvdmm7x/F448Ldae+rrMUk3VRlURTdbqHyVSF
//HWQd6jrlPA0d2F7A9gKmF7IVyFRQW4dC37xln7VOEevwNcg61HW49cugJt/q/vlBPb1IOmNMp7OLAR0Y
//HRmd2no5Q+ebWC2Wh4+i8cRxxqLysDecCX0mdszaBlFllrMwawZN6DOxz6TjKy+r3yA4NjdxuGvZ8XVd
//dQz9elf6zzh11nlPxnoUrgpXJR3h6mi5Wov4Elxt6afV6rz9D1nJkPUxObp1glZBq6QjaB07WmFQtMLZ
//aAWKDTlvycRybBW2SjrC1tGzFQdlK57NVmt8bK0Dck7OrcJWSUfYOnq20qBspSZbfwAcC7zA
