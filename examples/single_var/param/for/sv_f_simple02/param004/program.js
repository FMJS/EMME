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
         var x = new Int8Array(data.x_sab); Atomics.store(x, i+1, i+1);
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
         var x = new Int16Array(data.x_sab); id4_R_t2 = Atomics.load(x, i); report.push("id4_R_t2_"+i+": "+id4_R_t2);
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
outputs[1] = "id4_R_t2_0: 256;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 0;id4_R_t2_1: 2";
outputs[3] = "id4_R_t2_0: 256;id4_R_t2_1: 2";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 768";
outputs[5] = "id4_R_t2_0: 256;id4_R_t2_1: 768";
outputs[6] = "id4_R_t2_0: 0;id4_R_t2_1: 770";
outputs[7] = "id4_R_t2_0: 256;id4_R_t2_1: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9PgzAYBvC7n6JHl5CUvuhmNB5czOJFTeZhR2KCBxLnPLCT8buL/JNCS4BSzOC5Od69HbT4C30C
//54dj9HmMOGdhcOFv/Yh895q5N8UnEX/ifH8I3t7jLz2s2S37Og8D8nd+JJy4y0v+8t2Fw1THheY4pcfz
//7nqHoiL3KEbLr8D5u5psNBF/b/8afvxW0nOpH5evRFHR91C9kp+LtiIW3+zu6Z49PmNOh5vTyszIHbXj
//inmROxQVUZ8xZY/+d0jbQ4r7Y7veJDdIZS3yq4/7kzH0ZSGXRaVMzWUvP41NdptqfkU3Qtr9ssu6u/6L
//nHEQBaJA1IkTJRREFQvijgyUW70desLVwBNdLgEUgAJQp/wMVZp48R9EyQsPpIAU5nR+SOkek0YkSvGs
//NApQ8iaPwBN4Ak9TzaE8Rbm0OGSYQ9UqxdhtEioQBaJA1LxzqMGBapdDtYOr9SYPRIEoEDXZJMoOUi02
//emAKTIEpZFG2kTLIogyJkrd6q+UViAJRIGpO70WVlsCzlEfRkHkUkAJSQGpWb0YZEWWWSFG/rR6QAlJA
//amZvR5kzZbDhA1SAClAhlRqOKQupFPVKpVZ4iRNEgahppVJSNm4jlZKX13oqBaSAFJCaVCplk6jGVKoj
//Xe03e0AKSAGpiaVS1pnSb/gAFaDCnCKVGpGp7qlUV6R+ABrOp1o=
