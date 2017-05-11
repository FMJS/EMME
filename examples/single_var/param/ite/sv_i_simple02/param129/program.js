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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
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
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 <= 2) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
      }
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 2;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlkFLw0AQhe/+ij22UNhmd+qC0kOLFi8qRKXHIK6HQNt4SE/ifzfJJrLRCcRkc3u34WXeMtnJR56U
//2Tn/OOdSitReJnGSqyuxvE6taWopj5l9PxQNd1uxFp+z1Kpkn+TRonDoqpovREslVl15qmZ7NdtLrBoV
//9fE1PZW66tB1h04detf57l6c7upSNZ7qd9f6l9g83Ij7R9yZ9z6+qlmVWHXFqr138WsKw05h2CkMO0Vr
//x/F2Vy25NVEzReFclu5ZY/rzsD5kV38o7BG82zmf9qXT1dXrv2Unu36OX27nF5LDOwLewBt4j8L7536H
//wu0vKBzaCmgDbaA9Cm0aizZNgrYfyiOgDbSBdthQ7v3S/x3Ja2+AQA60gTbQDhrI+4DNx/FxWCtgDayB
//9VRhvA/WNAHWfhBXwBpYA+uwQZxGBHEKFsSBNtAG2kGDOA0O4hQsiANrYA2sgwZxGhzE+2L9DR2ALfg=
