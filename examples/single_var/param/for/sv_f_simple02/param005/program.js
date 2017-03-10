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
$.agent.start(
   `$.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 1;
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); Atomics.store(x, i+1, i+1);
      }
      $.agent.report(report);
      $.agent.leaving();
   })
   `);

// Thread t2
$.agent.start(
   `$.agent.receiveBroadcast(function (data) {
      var report = [];
      for(i = 0; i <= 1; i++){
         var x = new Int16Array(data.x_sab); id4_R_t2 = Atomics.load(x, i); report.push("id4_R_t2_"+i+": "+id4_R_t2);
      }
      $.agent.report(report);
      $.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $.agent.getReport();
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
outputs[0] = "id4_R_t2_0: 1;id4_R_t2_1: 770";
outputs[1] = "id4_R_t2_0: 0;id4_R_t2_1: 770";
outputs[2] = "id4_R_t2_0: 1;id4_R_t2_1: 0";
outputs[3] = "id4_R_t2_0: 0;id4_R_t2_1: 0";
outputs[4] = "id4_R_t2_0: 1;id4_R_t2_1: 2";
outputs[5] = "id4_R_t2_0: 0;id4_R_t2_1: 2";
outputs[6] = "id4_R_t2_0: 257;id4_R_t2_1: 770";
outputs[7] = "id4_R_t2_0: 257;id4_R_t2_1: 0";
outputs[8] = "id4_R_t2_0: 257;id4_R_t2_1: 2";
assert(-1 != outputs.indexOf(report));
