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
      var x = new Float32Array(data.x_sab); x[0] = 1.5000;
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
      var x = new Float32Array(data.x_sab); x[2] = 2.0000;
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
outputs[1] = "id6_R_t3: 0.1250;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 2.0000;id7_R_t3: 0.0000";
outputs[3] = "id6_R_t3: 8192.0000;id7_R_t3: 0.0000";
outputs[4] = "id6_R_t3: 8192.0019;id7_R_t3: 0.0000";
outputs[5] = "id6_R_t3: 0.0000;id7_R_t3: 1.5000";
outputs[6] = "id6_R_t3: 0.1250;id7_R_t3: 1.5000";
outputs[7] = "id6_R_t3: 2.0000;id7_R_t3: 1.5000";
outputs[8] = "id6_R_t3: 8192.0000;id7_R_t3: 1.5000";
outputs[9] = "id6_R_t3: 8192.0019;id7_R_t3: 1.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2ztPwzAQB/CdT5ERJEQaO7Z5iAGEEAsgwcBYIZWhEq+hTIjvTl40bnt2aCGu7fyZqnN81En745xw
//afr2MXv/mKVpMp3I8d14xo+T0cGo+DmZTtRCIE1f3iZPz8WhV+fJafK5O52w8cN4lu0Xc3n1am8/KaJ5
//+ZqVUVG9qqN19jJap62jWXHEy+P0tYwzLYce54Z4rmXX48IQl4bf27yfr+Ts5iK5vo1xbUvvnZErotcp
//yQx6XkHmFWReQeYVZN72rOp526ieV5HHquVj62t8d35ZXeSFbD9nrZg5KmebBjPbILMNcttgbhsUtkFp
//G1TNoLKtU9nWqWzrVPQ6m9N82XyVyHdGz65n3j80M9f5+u6kwAyYATM3mPXsFXG6uM+UyY5L9hvgABkg
//A2ReVWWrVs2Xl5uHhHlIhYEY7w2xjAkgBsQGhdh83shc3WTmIdZdE/2bTzIYuta5cKi+ABfg8rH6kg5t
//U+FtIPuHjQE2wAbYtr2tnH8EcvOQMA8FQpv+QQdiQAyIhbKt/KNPMhi66AsHuAAX4Ip0WzmM2sstbIfZ
//EWyDbbDN8c5yrVv7v4EvwAeWznTLjqAbdMOWs+cnmbHfLeu+cBANokG0QOs14RC9aB5x9i/eyn90ZAdi
//ANxV8XZFQ0GwXZGevY0KMipt56yKcjIvJ/NyMi8n824GsRVX9D6tlq/KXL4qc/mqKMnX7nli+t+mzo6n
//1a8sWANrYA1dUB6g1tX9RFMH0kAaSAuqUnPQD+UVZ7wXzpZ6oMAZOBsoZ7F2Rm0FsQ1ul6IiA2EgzPOK
//bLs9Ut5uL/sljoE4EAfiBtIt5RVy9BNPcAbOwFlom06XfVMebTpBGAgDYYPZdMZdj7kjjuqagnJQDspF
//2kvl7cNOJ84tdBvAOTiHDWlUXVWePgWFbbANtkVTw223vyqwx6P/Zd83XEy51A==
