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
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 769;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 769;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 514";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 514";
outputs[15] = "id6_R_t2: 769;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rgzAYB/D7PkWOGxTSJMbOjR1WRtllG3SHHqXgDsK67mBPo999Wq2k9nGzMb4c/jd58sSXKD/k
//Tzjf7pLvXcI5iyM/XIaJvGPT+ziaHY8532yjj8+04XnOHtjPdRzJcBUmYpLOUIejmwk7qXpkVRtVRfYq
//stcjq/m9ZtX8TvOqSDs26/grq0uj26yrmrpXU9c1db/musX97Nnj6xN7ecOaNV+zytP7ZNXsVWSvIns9
//stcjezXZq6u9+TtezheHl3yywsenS2dOs9l1g6IYnFGD8q9Bdbz8ovjEyPPTs/OZ76ts5v6KUwgIIAAE
//gIArBMQZAuUyT7sngLiqNQwz/xY0gAbQ0N3/Qbmcok8alAMaAtAAGkBDKxrOfgz6gkGSL7w9C2aeIIEC
//UAAKw+QJ6mywXHDZIk2o1ItzXpgxAAbAABgGyRhcsNA4YbDG4jR3ABfgAlwMkju45UJ1xkUALsAFuBg2
//i7DDwiqJsKbCzCe0ABWgAlSMZsdDubDKXUKhrRIK0AAaQMNo9kFcDoNtRqEtMwqAATAAxmh2R7QBQ3UG
//RgAwAAbAGN+eiSZcuMgptGVO4YEKUAEqeswpjOTSZUrhkVzYZhRgASyAhf4yCqco/JdQtKWimk8AC2AB
//LPrLJzrCQnWERQAsgAWwGCSbaEnFJclEcyh+ATQLYnA=
