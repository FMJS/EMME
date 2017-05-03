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
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 257;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 259";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 259";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 259";
outputs[15] = "id6_R_t2: 257;id7_R_t2: 259";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0czIJKi4sUtyoUBcugxAXAWtdpCvpu5s0aZimJ5pOJpfFvwtnzuQyCR/h
//Z6TcbNPvbSqlSOIgWkWpuhHz2yQOD8dSrjfxx2fW8LgQd+LnMolV9Bal3iybQfujq5k4qvpsVRtVYnuJ
//7fXZanGvebW406LqZR3r9+Qrryuj26xTQ91vqOuGetBw3fJ+duL++UE8vWDN2q9Z7ekDtmr2EttLbK/P
//9vpsr2Z7db23eMerxXL/ko9W+PB02cx5Prtp0CsHQ25Q/TVIh8svy0+MPT8/u5j5+pbP3F1IDgEPCAAB
//IOAKAe8EgWqZ5/0TwFzVGgalA9AAGkBDf/8H1XJ6Q9JADmgIQQNoAA2daDj5MRgKBsW+8O4smHkCAQWg
//ABTGyRPoZLBacNUhTajVy3OemTEABsAAGEbJGFyw0DphsMbiOHcAF+ACXIySO7jlgnrjIgQX4AJcjJtF
//2GFhlURYU2HmE9lfBqgAFaBiKjseqoUldwmFtkooQANoAA2T2QdxPgy2GYW2zCgABsAAGJPZHdEFDOoN
//jBBgAAyAMb09E224cJFTaMuc4hpUgApQMWBOYSSXLlMKn+XCNqMAC2ABLAyXUThF4b+EoisV9XwCWAAL
//YDFcPtETFtQTFiGwABbAYpRsoiMV5yQT7aH4BS0bYmA=
