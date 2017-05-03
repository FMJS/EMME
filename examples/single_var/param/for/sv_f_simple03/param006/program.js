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
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); x[i+1] = i+1;
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
outputs[1] = "id4_R_t2_0: 2;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 256;id4_R_t2_1: 0";
outputs[3] = "id4_R_t2_0: 258;id4_R_t2_1: 0";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 2";
outputs[5] = "id4_R_t2_0: 2;id4_R_t2_1: 2";
outputs[6] = "id4_R_t2_0: 256;id4_R_t2_1: 2";
outputs[7] = "id4_R_t2_0: 258;id4_R_t2_1: 2";
outputs[8] = "id4_R_t2_0: 0;id4_R_t2_1: 768";
outputs[9] = "id4_R_t2_0: 2;id4_R_t2_1: 768";
outputs[10] = "id4_R_t2_0: 256;id4_R_t2_1: 768";
outputs[11] = "id4_R_t2_0: 258;id4_R_t2_1: 768";
outputs[12] = "id4_R_t2_0: 0;id4_R_t2_1: 770";
outputs[13] = "id4_R_t2_0: 2;id4_R_t2_1: 770";
outputs[14] = "id4_R_t2_0: 256;id4_R_t2_1: 770";
outputs[15] = "id4_R_t2_0: 258;id4_R_t2_1: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2kFPgzAYBuC7v6JHl5CUfuhGNB5czOJFTeZhR2KCBxLnPLCT2X+XwUAK7bLRMl15bxvfvg5a8gTe
//lPPVOv1ap5yzJL6K5lFKkX/D/Nvqm8i+cb5cxe8f2Y8ep+yOfV8mMUWLKBVe1hXknyJ/5DHVcaE5TsXx
//srvdoajIPYrRyivwfq9mN5rIfrd8Sz63leJc2sflK1FU9D3UrpTnoq2I0YbdPz+wpxfMqb05bcyM3NE6
//rpgXuUNREe0ZU/bo/4e0PaS4P+bTWX6DNNaivPqsPx9DXxZyWTTKtL8clKcx292mmn/RjVB0vy623ZsL
//rgaHAA7AATjnAo5QgFMtiH9ibvzm7WDA0PUYEAEiQHTOTz61iRd/QZG88CYYhcAIGAGjf42R7rHnhBQp
//nn2sQiSnQQSGwBAYcjUNChTl2uKQYRrUqlRjd8iJQBEoAkWO5kTWITosJzIFqpEggSgQBaKcTZD6QeqA
//FzdjpkIwBabA1BCyJROkDLIlQ6Lk1GkyDkEUiAJRQ9qFVFuCoKfcibrkTsAIGAGjQe1QMqLILHmibskT
//kAJSQGpgu5fMmTJ4saNu2ROgAlSAalA7mw5lqof0iTqlTxNsvgRRIMqt9EnKwPtIn+TltZY+ASNgBIyc
//Sp/6pGhv+mSNqGb6BKSAFJByLH3qnSn9i509qEJABagAlcPpkyWmjk+fjkXqB0LIakI=
