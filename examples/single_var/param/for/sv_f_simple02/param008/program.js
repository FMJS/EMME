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
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); Atomics.store(x, i+1, i+2);
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
outputs[1] = "id4_R_t2_0: 1;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 512;id4_R_t2_1: 0";
outputs[3] = "id4_R_t2_0: 513;id4_R_t2_1: 0";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 3";
outputs[5] = "id4_R_t2_0: 1;id4_R_t2_1: 3";
outputs[6] = "id4_R_t2_0: 512;id4_R_t2_1: 3";
outputs[7] = "id4_R_t2_0: 513;id4_R_t2_1: 3";
outputs[8] = "id4_R_t2_0: 0;id4_R_t2_1: 1024";
outputs[9] = "id4_R_t2_0: 1;id4_R_t2_1: 1024";
outputs[10] = "id4_R_t2_0: 512;id4_R_t2_1: 1024";
outputs[11] = "id4_R_t2_0: 513;id4_R_t2_1: 1024";
outputs[12] = "id4_R_t2_0: 0;id4_R_t2_1: 1027";
outputs[13] = "id4_R_t2_0: 1;id4_R_t2_1: 1027";
outputs[14] = "id4_R_t2_0: 512;id4_R_t2_1: 1027";
outputs[15] = "id4_R_t2_0: 513;id4_R_t2_1: 1027";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2kFPwjAUB/C7n6JHSUi694ox0XiQGOJFTfDAcTHBA4mIh3EyfncnMKRbS7p1ndL9b9LHK1s7f9n+
//mZSrdfaxzqQUi/konaYZp8mVSK73nyj/JOVyNX99y790PxY34vN8Med0lmY0zLvU5q80GQyFaZws47wd
//L7qrHYaK3mOYrTiD4e/Z7Gaj/HvLl8X7T2V7LNVx/UwMFXsPVyvFsVgrNPgSt4934uEJa9rempZWRu+o
//jBvWRe8wVKi6YsYe+++wtYcN18d0PNlcIKW9KM4+79/MYS+TXqZSmY+XVXEYk91lavkV2wzb7ufZrrvu
//v8iZNBNFIApEgahTIYoMRO03JOkYqKR8OTSE6whPF8QACkABqFO+hzpYePoLovSND4GUAlJACkj9a6Rs
//t0kdEmW4V+oEKD2HUuAJPIGnWHMoZSgfbA575lCVyn5ul4TKMYcCUSAKREWaQ7UOlFsO5QaXcxIFokAU
//iIo2iQqDlMODnjdTCkyBKTDVhyzKBymPLMqTKD2NooRHMApGwag+vRh1sAUqUCDFbQZSUApKQal+vRvl
//ZZRfJsXNMikoBaWgVN9ekPJ3yuOZj5vFUpAKUkGqfr0l5epUgGSKGyZTlzAKRsGoqJIpLSAPkUzp29tB
//MgWloBSUiimZCmnU0WSqpl11kikoBaWgVFzJVHCn7M987UmlIBWkglQxJ1MtOVU/maqr1Ddna6h2
