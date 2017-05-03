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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 1;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 257;id7_R_t3: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm01PwkAQhu/+ih41ISnt0jbReJAY4kVN8OCRmOCBRMQDnIz/3X4BK2yppZ0tH89tM7sz/dj2yZuZ
//HdedLeZfi7nrOpNxOBqO5ura6d5MxtFy7LrT2fj9I17w0Hdune/LydgfvY7mXif2UOnoquPE1l4y9hNr
//kI4yaxYzsWYRM6sXr5i+TT4Tu6/F0O2qwN7Touv2oMAeFlw3v58f5+7p3nl8PsVnS+3rJ9Kjr62B0Roa
//I+hxlTGuMsZVxrjKGHf9rkOjVV8bGNcGm2uzPR72B+km/9m55VuLPbuJd9Gkt2vS3zWp8slol2dk9sxv
//fJB/nMb4Zu/M8+U196zyQ1y4Jih4QAEonB8U6v/368nVxnflkWC4amVQ7AaCH4QgASSgE+ogYbXBnk0k
//KDEkRCABJJwfEuoKgbaBoH9s8pggvwAk0A21CLJ6JVYxoW9Ek0AgtwAQUA01VEM7ODCrBilIoBqABKqh
//QnZymyCrh/dtYiJANQAEgGClIlFJNbSDA7NqkIIEVQowgW7YoxDRNiaUZUxQuQATZ4iJesWJw9QSdtFB
//XgJwoC8qFyzaRkfP+GmSqwASQKIddXFwiCivb6AuAAfgOJFejO1JDTv7d2Js2POY5f0ZKAmAABDa68No
//Agf/7sIohwT1DYAAENrswmgWCEoMCFQyAAKnKcV7MOT0gTwkyCqACDSDhQ6MZiFRcrR6bxyQUwAHKAbx
///gsbikEKESgGEIFisNB90SwkAhQDOAAHx9p7YUMxSCGCygSQQDNY6LyQq0vYgATVCiDByUjhvgvbtQp5
//cJCPABtoC/GuC7n6BTkKEAEijr7nwnZNo0ls/AJ95waQ
