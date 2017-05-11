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
      var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
outputs[1] = "id2_R_t1: 2;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 512;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 514;id5_R_t2: 0";
outputs[4] = "id2_R_t1: 0;id5_R_t2: 2";
outputs[5] = "id2_R_t1: 2;id5_R_t2: 2";
outputs[6] = "id2_R_t1: 512;id5_R_t2: 2";
outputs[7] = "id2_R_t1: 514;id5_R_t2: 2";
outputs[8] = "id2_R_t1: 0;id5_R_t2: 512";
outputs[9] = "id2_R_t1: 2;id5_R_t2: 512";
outputs[10] = "id2_R_t1: 512;id5_R_t2: 512";
outputs[11] = "id2_R_t1: 514;id5_R_t2: 512";
outputs[12] = "id2_R_t1: 0;id5_R_t2: 514";
outputs[13] = "id2_R_t1: 2;id5_R_t2: 514";
outputs[14] = "id2_R_t1: 512;id5_R_t2: 514";
outputs[15] = "id2_R_t1: 514;id5_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmr1qwzAUhfc+hcYWArKcGxtaOjSU0KUtpEPGUEgGQ9N0SKaSd69c/8myTGxZspeziaOra1ny/Wwf
//xPnxfPo5nzhnyS7crrcncc+Ch2S3SNuhbHN+OO72XzLgZcke2e9tETeTI+bbjWzdzVhNJUXNInQ1y56q
//UaqGuhorahahq0K2D5/J96ycd1NXZ6fq1KJn12/qUct18/lc2NPbM3t9x+qYVke7ezVLpUbGWDVDtVJq
//hkqNjLFqBjJmIGMG0jNke7xerv43uTbL4p7lyCAd3dYp8s5qHw0jjZ2iuPyq8YgpUebR2ciPTTrycsNN
//5R6i3FHuKPf+5S4a5V4mDfwXu3k57RCwEIAAIAAIOHnnlxMQY0IgdgABAgQAAUCgIwQaL/uxEHB90ewA
//oP73hyh/lD/K3/d/f7Oz3J5gwF+/puc5e3oBQAAQAAR49gJcAKCzE2CNhbo/ADAADACDZ3/ALRhib2Ag
//gAFgABjG8gzssGDlGFhDQfUR5JcDoAAoAArjnyAot0G4cxLIykkABAABQGCCcwX9EWDrJZCllwA0AA1A
//wwSnDYagIfaGBgIagAagYcozCF3A4MJPIEs/gQAFQAFQ8OInKF6iSzdhbnyUbL0EAAAAAAB8eAlOy/+a
//kzAUCrqPACwAC8CCDx/BExZiT1ggYAFYABY8ewgDodDHQeiOhD9Y+/q9
