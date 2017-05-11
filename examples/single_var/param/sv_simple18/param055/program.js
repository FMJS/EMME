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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 769;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 512";
outputs[7] = "id6_R_t2: 769;id7_R_t2: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUGWvE3nFA8OGV5UmIcdi1APBec8dCfZd7ddu9Jtb7Wm6ZbBcytv3vRPWn6U
//h0i5XKVfq1RKkcRhNItSfSOGt0k82h5LuVjG7x9Zw+NE3InvyyTW0TxK1SCbQZujq4HYqQZs1dSqxPYS
//2xuw1eJe82pxp0VVZR2Lt+Qzr+tad71ODfWgoW4a6mHDdcv7WYv75wfx9II1a79me08fstV6L7G9xPYG
//bG/A9hq21+z3Fu94NpluXvLOCm+fLps5zGc3DapycMQN6t8GaXv5afmJsefnZxczX+f5zPWF5BBQQAAI
//AAFXCKgDBKplHvZPAHNVaxhG4TVoAA2gob//g2o51TFpIAc0jEEDaAANnWg4+DE4FgyafeHdWUCeABSA
//ggd5Ah0MVguuO6QJe/XynMgYAANgOIeMwQULrRMGayyQO4ALcOFB7uCWC+qNC2QR4AJcnDiLsMPCKomw
//pqKeTxilQQWoABW+7HioFpbcJRTGKqEADaABNHizD+L/MNhmFMYyowAYAANgeLM7ogsY1BsYY4ABMACG
//f3sm2nDhIqcwyClABag4g5yilly6TCkClgtkFGABLPifUThF4a+EoisVyCeABbA4XT7RExbUExbIJoAF
//sDhNNtGRiv8kE+2h+AGFpWJg
