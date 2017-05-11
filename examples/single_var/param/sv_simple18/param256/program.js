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
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 771;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 771;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 771";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 771";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 771";
outputs[15] = "id6_R_t2: 771;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n8JlC4HJeBwtLV00lNBNW0gXWUrBLISm6cKsSt69Go2oObZmZrws/p2cOeNllA/5
//GSF2++R7nwjhxJEfrsLEvXPm93EUnI6F2O6izWfa8LxwHpyf6zhyw3WYyFk6g45HNzOnVvXYqqpUie0l
//ttdjq/m9ZtX8TvOqTDu2H/FXVncr3dU6tdS9lrpqqfst1y3u5+A8vj45L29Ys+5r1nh6n61We4ntJbbX
//Y3s9tlexvarZm7/j1WJ5fMm1FT49XTpzns1uG5TFYMANun8N0unyy+ITY8/Pz85nvq+zmYcrwSFAQAAI
//AAFbCMgzBMplnvdPAHNVbRgC/xY0gAbQ0N//QbmcckgayJyGQIIG0AAajGg4+zEYCgaXfeHmLFTzBAIK
//QAEojJMn0NlgueCuQZrQqBfnvDBjAAyAATCMkjHYYKFzwqCNRT13ABfgAlyMkjvY5YL64qKWRYALcAEu
//Rsgi9LDQSiK0qajmE+lfBqgAFaBiKjseyoUlewmF0kooQANoAA2T2QdxOQy6GYXSzCgABsAAGJPZHWEC
//BvUFRi2lABgAA2BMZM9EFy5s5BRKL6cIJKgAFaBiwJyiklzaTCk8lgvNjAIsgAWwMGBGYRWF/xIKUyoa
//+QSwABbAYsB8oicsqB8s6tkEsAAWwGKwbMKQikuSie5Q/AIk5mKo
