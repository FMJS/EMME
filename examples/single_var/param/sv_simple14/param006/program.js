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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      $.agent.report(report);
      $.agent.leaving();
   })
   `);

// Thread t2
$.agent.start(
   `$.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      $.agent.report(report);
      $.agent.leaving();
   })
   `);

// Thread t3
$.agent.start(
   `$.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[1] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 2;id7_R_t3: 2";
outputs[3] = "id6_R_t3: 2;id7_R_t3: 258";
outputs[4] = "id6_R_t3: 66050;id7_R_t3: 258";
outputs[5] = "id6_R_t3: 2;id7_R_t3: 514";
outputs[6] = "id6_R_t3: 258;id7_R_t3: 258";
outputs[7] = "id6_R_t3: 65794;id7_R_t3: 514";
outputs[8] = "id6_R_t3: 65794;id7_R_t3: 258";
outputs[9] = "id6_R_t3: 514;id7_R_t3: 258";
outputs[10] = "id6_R_t3: 514;id7_R_t3: 514";
outputs[11] = "id6_R_t3: 256;id7_R_t3: 514";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 514";
outputs[13] = "id6_R_t3: 65792;id7_R_t3: 256";
outputs[14] = "id6_R_t3: 65792;id7_R_t3: 258";
outputs[15] = "id6_R_t3: 65792;id7_R_t3: 514";
outputs[16] = "id6_R_t3: 0;id7_R_t3: 256";
outputs[17] = "id6_R_t3: 0;id7_R_t3: 258";
outputs[18] = "id6_R_t3: 258;id7_R_t3: 514";
outputs[19] = "id6_R_t3: 256;id7_R_t3: 258";
outputs[20] = "id6_R_t3: 66050;id7_R_t3: 514";
outputs[21] = "id6_R_t3: 256;id7_R_t3: 256";
assert(-1 != outputs.indexOf(report));