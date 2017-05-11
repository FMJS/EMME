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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 > id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 0";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm81vgjAYxu/7KzhqYoLllZps8aDZzA77SHSLR7KMHUim7oCnZf/7+HJWVhI+WujYc2te5IGW/vK0
//j2Db+0P4cQht2wr8ibfyQufSGl8Fviu0p8e2bW/3/tt79OPbhTWzPgeB73gbL2Sj6GxKWsORNTgqxdVU
//J1+dClVXWmWR2vYl2MV1R1AW61RQnxTouAX17Lpf1vzh2rp/7F/PkvqpPxNp1ZVWRQWSKpBUgfIK6eiu
//FstkeM/G7HjH0Znj+OyzoZMcnMoPZldYZs9Pql8kLVdNFdebWDFtJ+P7ut/5s+X8bn0zvLABEADqGqCf
//3mrBRxzLluFhgAfwdOk+Tp4sVd4jjr1CeBjgATwtwuMUO09jdByp72gCB64DcAxZsjUGh7oCB3sdgNPp
//co10LdcI8ACeXrsO6XGdlsFhAAfgGBVRC6s5ZQF1pgl4AE+f4+ky6FQLpxWCwwAOwDE0mm7iOfKYoCE4
//DOAAHONj6TLYVAml4TaApveRdP1FmnZosLcBNKbG0U2WaARwAM7/jKLru02r0OD/G0BjVgxNGmJoAjyA
//p/8xNCmPoUlPMABwAI5JMTQpj6FJTwwNcACOOTE0KY6h4TaApvcxNCmOobG3ATT/IIYm5TE0wAE4vY+h
//SXEMrXBfE0PDFUGje7qcrsqlU5cXaPDG0OjuWZUJX2VqNxyx3F1w6fV4k32NxIi4ku8+z12IV/uU4Gn1
//DHbAjuHs/DIcNeSIz0I/NwzcgBuDPKf+S51FjlPinQFwA27+tN/Up0buNnqYwRoNzJjkNaTcawjcgJue
//ew0p9pqyzHwDEtd2+g==
