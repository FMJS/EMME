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
outputs[1] = "id4_R_t2_0: 1;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 256;id4_R_t2_1: 0";
outputs[3] = "id4_R_t2_0: 257;id4_R_t2_1: 0";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 2";
outputs[5] = "id4_R_t2_0: 1;id4_R_t2_1: 2";
outputs[6] = "id4_R_t2_0: 256;id4_R_t2_1: 2";
outputs[7] = "id4_R_t2_0: 257;id4_R_t2_1: 2";
outputs[8] = "id4_R_t2_0: 0;id4_R_t2_1: 768";
outputs[9] = "id4_R_t2_0: 1;id4_R_t2_1: 768";
outputs[10] = "id4_R_t2_0: 256;id4_R_t2_1: 768";
outputs[11] = "id4_R_t2_0: 257;id4_R_t2_1: 768";
outputs[12] = "id4_R_t2_0: 0;id4_R_t2_1: 770";
outputs[13] = "id4_R_t2_0: 1;id4_R_t2_1: 770";
outputs[14] = "id4_R_t2_0: 256;id4_R_t2_1: 770";
outputs[15] = "id4_R_t2_0: 257;id4_R_t2_1: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2kFPgzAYBuC7v6JHlywp/dBhNB5czOJFTeZhR2LCDiTOeWAn438XtzFXaEmhFF15b45vXwctPoE3
//5Xy9yT42GecsTS7ieZxRHFyz4ObwSeSfOF+tk+Vb/qWHKbtln+dpQvEizsQ47wq3f8XBaMxUx4XmOO2O
//F93VDkVF7lGMVlzB+Pdq9qOJ/Hur1/T9p7I7l+px+UoUFX0PVSvFuWgrYvTF7p7u2eMz5rS7OS3NjNxR
//Oa6YF7lDURHVGVP26H+HtD2kuD/m09n2BimtRXH1ef92DH1ZyGVRKlN9OSxOY7a/TTW/ohth1/2y2Hc3
///Rc542qiBIgCUSDqVIgSCqIOCxL0DFRQvh1awlXDE11OABSAAlCn/Ax1NPHiL4iSF94FUhGQAlJA6l8j
//pXtM6pEoxbNSL0DJORSBJ/AEnnzNoUJF+WhxyDKHqlQOY5skVIY5FIgCUSDK0xyqc6DMcigzuIyTKBAF
//okCUt0mUG6QMXvSsmYrAFJgCU0PIomyQssiiLImS06hocgWiQBSIGtK+qKMlCB3lUdRlHgWkgBSQGtTO
//KCui7BIpapdIASkgBaQGtjvKnimLFz5ql0kBKkAFqAa1Q8qUKQepFLVKpSJs4gRRIMqvVErKxl2kUvLy
//Ok+lgBSQAlJepVIuiapNpRrSZZ5KASkgBaQ8S6WcM6V/4esOqghQASpA5XEq1RFTzVOppkh9A0NNp2I=
