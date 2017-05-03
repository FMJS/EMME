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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); x[i+1] = i+0;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      for(i = 0; i <= 1; i++){
         var x = new Int16Array(data.x_sab); id4_R_t2 = x[i]; report.push("id4_R_t2_"+i+": "+id4_R_t2);
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
outputs[0] = "id4_R_t2_0: 0;id4_R_t2_1: 0";
outputs[1] = "id4_R_t2_0: 0;id4_R_t2_1: 1";
outputs[2] = "id4_R_t2_0: 0;id4_R_t2_1: 512";
outputs[3] = "id4_R_t2_0: 0;id4_R_t2_1: 513";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2kFPwjAYxvG7n6JHSZZ07fSi8SAxxIua4IHjYjIPJCAexsnw3R0bm+vWkuHojPC/SV/esrXLL+sT
//pVyt0891KqWYJ1fxNE51HN6I8Lb6pLJPUi5Xyfsi+9LjWNyJr8t5ouNZnKog64ryv+JwFAjbuHKM62K8
//7G53WCpmj2W28g6Cn7vZzaay7y3f5h/bSnEt7XHzTiwVd49uV8prcVbUaCPunx/E0wtrerw1bayM2dEa
//t6yL2WGpqPaKWXvcv6OdPdryfEzHk/wBaexFefdZfz6Hu6zMsmqU9f5yVF7GZPeYOn7FNUPR/Trbdm8u
//JOAADuD8c3CUBZxqQ8KBuQmbjwMMwRAMnel7T23h1V9AZG48FEERFJ0qRa5XngEhsrz3eGRIwRAMwdCp
//JkGRpVzbHN0zCWpVqrmhCIqgiIzIG0TdMiKAAiiAIj3qcmjzQ1SHYxtIgRRIkSv5JapHrnRUoK6VhiiI
//gqhz+u+j2hZEnjInDUZgBEakTj4p6pc6QRREQRS50xBI9TjWwRRMwRTJ07GQ8pA8/ZKoCKIgCqJOKnky
//8m8fyZO5vWAERmBE8hQOTNHe5AmiIAqieF/qcqjzjpT7WAdTMAVTJE+DIXV48nQoUd/aFmZ+
