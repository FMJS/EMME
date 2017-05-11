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
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 771;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 256";
outputs[7] = "id6_R_t2: 771;id7_R_t2: 256";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUHWvE0rigeHDC8qzMOORaiHgnMeupPsu9uuXem2t9olqcvguZU3b/onLT/K
//Q6RcrvKvVS6lyNIomSW5uhHj2yyNt8dSLpbp+0fR8DgRd+L7MktVMk/yYFTMoM3R1UjsVEO2qltVYnuJ
//7Q3ZanWvZbW606oaFB2Lt+yzrKtWd7tOHfWwo6476lHHdev7WYv75wfx9II1679me08fsdV2L7G9xPaG
//bG/I9mq2V+/3Vu94NpluXvLOCm+frpg5Lmd3DQb1YMwNqt8GaXv5af2JsefnZ1czX+flzPWF5BAgIAAE
//gIArBIIDBJplHg9PAHNVYxji6Bo0gAbQMNz/QbOcwX/SQPY0xAFoAA2gwYqGgx+D/4JBsS/cngXkCUAB
//KHiQJ9DBYLPgyiJN2KvX50TGABgAwzlkDC5Y6J0wGGOB3AFcgAsPcge3XNBQXCCLABfg4tRZhBkWRkmE
//MRXtfELpCFSAClDhy46HZmHJXUKhjRIK0AAaQIM3+yCOh8E0o9CGGQXAABgAw5vdETZg0FBg7KQUAANg
//AAxP9kz04cJFTqGRU4AKUHEGOUUruXSZUoQsF8gowAJY8D+jcIrCXwmFLRXIJ4AFsDhdPjEQFjQMFsgm
//gAWwOFE2YUnFMclEfyh+AGtoYnQ=
