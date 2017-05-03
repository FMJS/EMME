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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 771;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 771;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 771;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 514";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 514";
outputs[15] = "id6_R_t2: 771;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n8JlCwEzc2a0tHTRUEI3bSFdZCkFsxCapguzKnn3ajSi5tiacbws/p2cOeNllA/5
//Gdfd7ePvfey6ThR6wSqI5Z0zv49C/3TsuttduPlMGp4XzoPzcx2FMlgHsZglM+h4dDNzKlXFVnWpSmwv
//sb2KrWb3mlazO82qIunYfkRfaV2Wust1aqirhrpuqHsN183v5+A8vj45L29Ys/ZrVnt6j62We4ntJbZX
//sb2K7dVsr673Zu94tVgeX3JlhU9Pl8ycp7ObBkU+6HOD8q9BOl1+mX9i7Pn52dnM93U683DlcggQEAAC
//QMAWAuIMgWKZ5/0TwFzVGAbfuwUNoAE09Pd/UCynGJIG6k6DL0ADaAANnWg4+zEYCgbJvvDuLJTzBAkU
//gAJQGCdPoLPBYsFlhzShVs/PeWHGABgAA2AYJWOwwULrhMEYi2ruAC7ABbgYJXewywX1xUUliwAX4AJc
//jJBFmGFhlEQYU1HOJ7QAFaACVExmx0OxsGQvodBGCQVoAA2gYTL7IC6HwTSj0IYZBcAAGABjMrsjuoBB
//fYFRSSkABsAAGBPZM9GGCxs5hTbMKRSoABWgYsCcopRc2kwpFMuFaUYBFsACWBguo7CKwn8JRVcq6vkE
//sAAWwGK4fKInLKgfLGrZBLAAFsBiqGyiIxWXJBPtofgFMuFiXA==
