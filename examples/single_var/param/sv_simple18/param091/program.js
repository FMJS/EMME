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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 258;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 258;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 258;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 513";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 513";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 513";
outputs[15] = "id6_R_t2: 258;id7_R_t2: 513";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYAiyXJMS4eGErq0hXTIaAruYGiaDs5U8u614wuKc9w6snwZ/s0cHfkimw/z
//I853++R7n3DO4sgP12Eib9n8Lo4W5THn21308Zk2PC3ZPfu5jiMZbsJEzNIZ6nh0M2MnVY+saqOqyF5F
//9npkNb/XrJrfaV4Vacf2Pf7K6tLoNuuqoe411HVD3W+4bnE/B/bw8sieX7Fm7des9vQ+WTV7FdmryF6P
//7PXIXk326npv/o7Xy9XxJZ+scPl06cx5NrtpUBSDC2pQ/jWoysuvik+MPD89O5/5tslmHq44hYAEAkAA
//CLhCQJwhUC3zvH8CiKvaw6B90AAaQEN//wfVcoohaVAOaAhAA2gADZ1oOPsxGAoGSb7w7iyYeYIACkAB
//KIyTJ6izwWrBZYc0oVYvznlhxgAYAANgGCVjcMFC64TBHouT3AFcgAtwMUru4JYL1RsXAbgAF+Bi3CzC
//DgurJMKaCjOf0EKCClABKqay46FaWOUuodBWCQVoAA2gYTL7IC6HwTaj0JYZBcAAGABjMrsjuoChegMj
//ABgAA2BMb89EGy5c5BTaMqdQoAJUgIoBcwojuXSZUngkF7YZBVgAC2BhuIzCKQr/JRSdqajlE8ACWACL
//4fKJnrBQPWERAAtgASxGySY6UnFJMtEeil+hB2Iw
