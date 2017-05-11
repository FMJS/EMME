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
      for(i = 0; i <= 3; i++){
         var x = new Int8Array(data.x_sab); x[3] = 75.0+i;
      }
      var x = new Int32Array(data.x_sab); id3_R_t1 = x[0]; report.push("id3_R_t1: "+id3_R_t1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2.toFixed(4));
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
outputs[0] = "id3_R_t1: 1308622848;id4_R_t2: 0.0000";
outputs[1] = "id3_R_t1: 1308622848;id4_R_t2: 8388608.0000";
outputs[2] = "id3_R_t1: 1308622848;id4_R_t2: 33554432.0000";
outputs[3] = "id3_R_t1: 1308622848;id4_R_t2: 134217728.0000";
outputs[4] = "id3_R_t1: 1308622848;id4_R_t2: 536870912.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlk9Lw0AQxe9+ij1aKO7OzCZZWzxYpHhRoR56DEI8BGzrIT2J393YTUv+7AQtNOQwOYX3MrOTfcmP
//1Xq3Lz73hdYqzyhdpQXMFJBxMaKzbp5n9lfEmTI3pry03uyy94/y8ceFulNf13mG6bqsSs1Une5hMlVh
//B1mHuo6fp6ED2wvYXsD0QrYCmQpq61Dqm7d8W+tkWIevQdahrsOt74OafKv75wf19CLpjDGdzi4GdGB0
//ZHRq636GzjexWiwPH0XjieOMZeVhbzgT+kzsmLUNosr0szBrBk3oM7HPpOMrL6vfIDg2N3G4q+/4uq46
//hn69K/1nnDpyLjZOoCpQlXQEqqOFai3iS0C1pZ9Wq8P2P1gliiJrCYWrwlVJR7g6dq7CoFyFs7kKZBGS
//BOXAKmCVdASsowcrDgpWPBusEcUuMbcgJ1YBq6QjYB09WGlQsFITrD/Sr7oB
