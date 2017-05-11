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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[1]; report.push("id7_R_t3: "+id7_R_t3);
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm81OwkAURvc+RZeakJR2OiXRuJAY4kZNcMGSmOCiiYiLsjK8u/0DRpiitJ1pkbNr7nQutNPv8DG3
//13UXy/hzGbuuE83C6Xgai2unfxPNButj150vZm/vyQkPQ+fW+bqMZv50Mo29XjJDZEdXPSeJBumxn0Zl
//dpRH85xpNM+YR73kjPlr9JHGfSWHGhcl8UDJrsZlSTws+dzi+6ycu6d75/H5P15bFt9ekZp9G5XaaKjN
//oOYV2rxCm1do8wpt3u29DrVR9VypPVfunpuv8Xg4yhb5x8qt71oys5/OLhv0Dg36hwZFMTg4NHOgn1l8
//8VHxcGrz62fnM18m6czVhauTuY/Mkfn5yby+kreDm4Xvmxe55lMrS196iB/x8xtfS/ybBfZsil80IP4A
//8SP+8xN/3R/3tqWvPmxNAoH/++AAL1CLFZtbYhUI6kKwB4D0kb51J9CO8PVOoD4OcALgACdwxH7hPis2
//F+/bBILECSB9pN9wNeAoJ9CO8PVOoD4OqBAABLxAhSJA20AQxoBA1QAgnCEQ6hUGuukPTEGC/QMQgWc4
//uljQNiQC7aPJngI4AAemHUPnYPB7bQHHACJAxMn1GuwPKoCp3mmwEy9y4g6QPtLvRv9BE8L/c/dBZRxQ
//cQAIeAErPQnNAkEYAwIVB4DA24nG+xTM+QPzkGD/AETgGSz0LjQLiV9eVWZPARyAg+72M9hwDKYQgWMA
//ETgGCz0OzUJC4hjAATg41b4HG47BFCKoTAAJPIOFXghzdQkbkKBaASR429Fwf4TtWoV5cLAfATbwFsZ7
//JszVL9ijABEg4uT7KGzXNJrExje+gaM7
