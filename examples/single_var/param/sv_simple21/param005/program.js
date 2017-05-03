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
      var x = new Int16Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
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
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 1;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 256;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 257;id5_R_t2: 0";
outputs[4] = "id2_R_t1: 0;id5_R_t2: 1";
outputs[5] = "id2_R_t1: 1;id5_R_t2: 1";
outputs[6] = "id2_R_t1: 256;id5_R_t2: 1";
outputs[7] = "id2_R_t1: 257;id5_R_t2: 1";
outputs[8] = "id2_R_t1: 0;id5_R_t2: 256";
outputs[9] = "id2_R_t1: 1;id5_R_t2: 256";
outputs[10] = "id2_R_t1: 256;id5_R_t2: 256";
outputs[11] = "id2_R_t1: 257;id5_R_t2: 256";
outputs[12] = "id2_R_t1: 0;id5_R_t2: 257";
outputs[13] = "id2_R_t1: 1;id5_R_t2: 257";
outputs[14] = "id2_R_t1: 256;id5_R_t2: 257";
outputs[15] = "id2_R_t1: 257;id5_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmkFrgzAYhu/7FTluIMTY1MDGDiuj7LINukOPMrCHwrruYE+j/31xVo0xUo2JXt5bePPlMyZ+j/oS
//So+n7OeUUUr2aZRskozdk/Bhny7zdiTblB6O6e5LBrysyCP5vS3jAjlikWxl6y4gDZUrahGhq0X2XI1z
//NdJVoahFhK4y2T587r+Dat5tXZ2dqvMOvbh+W487rnuZz5k8vT2T13esjml1tLtXs9RqbIxVM9QrpWao
//1dgYq2bgxgzcmIHrGYo93qzW/5vcmGV5z3JkmI/u6mSXznofDSONnay8/Lr1iClR5tHFyI9tPvJ8Q03l
//zlDuKHeU+/ByZ61yr5KG/ovdvJx2CIiWMSAACAACLt751QTYlBAQDiAgAAFAABDoCYHWy34qBFxfNDsA
//qP/9DOWP8kf5+/7vb3dW2xOO+OvX9EvOgV4AEAAEAAGevQAXAOjtBFhjoekPAAwAA8Dg2R9wCwbhDQwC
//YAAYAIapPAM7LFg5BtZQUH0E+eUAKAAKgML0JwiqbWDunARu5SQAAoAAIDDDuYLhCLD1ErillwA0AA1A
//wwynDcagQXhDgwAagAagYc4zCH3A4MJP4JZ+ggAUAAVAwYufoHiJLt2EhfFRsvUSAAAAAADw4SU4Lf9r
//TsJYKOg+ArAALAALPnwET1gQnrAggAVgAVjw7CGMhMIQB6E/Ev4AGxH6/Q==
