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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 768";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9rgzAYBvD7PkWOGxSieY2OjR1WRtllG3SHHmVgD8K67mBPo999Wq3Y9nWzMbYpPDd588Y/UX7I
//Q6RcrrLvVSalSJMwnsaZuhPefZpE22MpF8tk/pk3PI/Fg/i5ThMVz+LMH+UzaHN0MxI71YCt6kaV2F5i
//ewO2Wt5rUS3vtKz6ecfiI/0q6qrR3axTSz1oqeuWethy3ep+1uLx9Um8vGHNuq/Z3tOHbLXZS2wvsb0B
//2xuwvZrt1fu95Tuejiebl7yzwtuny2d6xey2Qb8ajLhB9dcgbS8/qT4x9vz87HLm+6yYub6SHAIEBIAA
//ELCFgH+AQL3M3vAEMFc1hkH7CjSABtAw3P9BvZz+KWkgCzRo0AAaQEMvGg5+DE4Fg2JfeH8WkCcABaDg
//QJ5AB4P1gqseacJevTonMgbAABguIWOwwULnhMEYC+QO4AJcOJA72OWCBuMCWQS4ABdnziLMsDBKIoyp
//aOYTUXgLKkAFqHBlx0O9sGQvodBGCQVoAA2gwZl9EMfDYJpRaMOMAmAADIDhzO6IPmDQYGBogAEwAIZ7
//eya6cGEjp9DIKUAFqLiAnKKRXNpMKQKWC2QUYAEsuJ9RWEXhv4SiLxXIJ4AFsDhfPjEQFjQQFsgmgAWw
//OE820ZOKY5KJ7lD8AoRAYnA=
