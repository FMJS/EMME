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
outputs[1] = "id4_R_t2_0: 2;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 512;id4_R_t2_1: 0";
outputs[3] = "id4_R_t2_0: 514;id4_R_t2_1: 0";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 3";
outputs[5] = "id4_R_t2_0: 2;id4_R_t2_1: 3";
outputs[6] = "id4_R_t2_0: 512;id4_R_t2_1: 3";
outputs[7] = "id4_R_t2_0: 514;id4_R_t2_1: 3";
outputs[8] = "id4_R_t2_0: 0;id4_R_t2_1: 1024";
outputs[9] = "id4_R_t2_0: 2;id4_R_t2_1: 1024";
outputs[10] = "id4_R_t2_0: 512;id4_R_t2_1: 1024";
outputs[11] = "id4_R_t2_0: 514;id4_R_t2_1: 1024";
outputs[12] = "id4_R_t2_0: 0;id4_R_t2_1: 1027";
outputs[13] = "id4_R_t2_0: 2;id4_R_t2_1: 1027";
outputs[14] = "id4_R_t2_0: 512;id4_R_t2_1: 1027";
outputs[15] = "id4_R_t2_0: 514;id4_R_t2_1: 1027";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2kFPgzAYBuC7v6JHl5CUfmBMNB5czOJFTeZhR2IyDyTOeWAn438XYUwK7VIoRVfem+u3r4MWn8Ab
//ON/uso9dxjlL13GyTDJKwisWXh8+ifwT55vt+vUt/9L9nN2wz/N0TckqyUSQd0XFX0k4C5hqXGjGqRyv
//utsdiorco5itOoPg92z2s4n8e5uX9P2nUh5Le1w+E0VF30PtSnUs2oqYfbHbxzv28IQ1HW5NGysjd7TG
//Fesidygqor1iyh7975C2hxTXx3K+KC6Qxl5UZ5/3F3Poy0Iui0aZjpej6jAW+8tU8yu6Gcru59W+u+u/
//yBlXE0UgCkSBqFMhSiiIOmxIODJQYfNy6AnXEZ4uBIACUADqpO+hagsv/oIoeeNdIBUDKSAFpP41Urrb
//pBGJUtwrjQKUnENF4Ak8gSdfc6hIUa5tDlnmUK3KYW6ThMowhwJRIApEeZpDDQ6UWQ5lBpdxEgWiQBSI
//8jaJcoOUwYOeNVMxmAJTYGoKWZQNUhZZlCVRcholQophFIyCUVN6Maq2BZGjQIqGDKSgFJSCUtN6N8rK
//KLtMivplUlAKSkGpqb0gZe+UxTMf9YulIBWkglTTekvK1CkHyRT1TKYuYRSMglFeJVNSQO4imZK3d4Rk
//CkpBKSjlUzLl0qijyVRHu7okU1AKSkEpv5Ip507pn/mGkyqGVJAKUvmcTA3kVPdkqqtS35AaqH4=
