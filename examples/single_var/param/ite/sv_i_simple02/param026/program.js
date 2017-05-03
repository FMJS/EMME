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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 == 0) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
      }
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
outputs[0] = "id6_R_t2: 2;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 1;id8_R_t2: 0";
outputs[2] = "id6_R_t2: 2;id8_R_t2: 2";
outputs[3] = "id6_R_t2: 1;id8_R_t2: 2";
outputs[4] = "id6_R_t2: 2;id8_R_t2: 1";
outputs[5] = "id6_R_t2: 1;id8_R_t2: 1";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[7] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmDtvwjAUhff+Co8gITl+xVUrBlAbdehDCkWMUdV0iFRIhzBV/e/Nk5ropjHECIa7Wcfnhptrfzoo
//lKbb7GubUUqS2I/CKOM3hN8m8XW99ihdp/HHZ254mJMp+R4lMY9WUcYmeYUoV+MJ2VMlqCpDFaBXgF4J
//qlWvhVp1Wqksd6zfkk2hc8Nt6qJDlx266tD9jt+t+/khs+c78vSCM7OfWevtfVA1vQL0CtArQa8EvQr0
//qra3OuNwHpSHvDfh3SS9onbUlBRbzYvnG6x5RFBfE+ABcG1Vt1gVddW6HOl7uomnwexxcT++ohDbDNlG
//tpHtQWzLoWzL07Bt5jZHtpFtZNtlbu+GeXBq15UuMhu5Rq6Ra6eZbcO1PAXXZl4z5Bq5Rq5d5rU6Oq+V
//u7xGrpFr5NppXquj83og117Otb7wb2fnuo1/o9cdd1RfLNfnmhnvoc/vpQ/mzPosWl1osAsNdqHBLnQv
//18YHsoZsDW92sm244Or/+H4NlzZ4c8Qb8Ua83eJt/Fc/GG7eH92WaDNEG9FGtN2iLQegLS3R/gWMgi9K
