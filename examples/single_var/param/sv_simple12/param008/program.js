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
      var x = new Float32Array(data.x_sab); x[0] = 1.00;
      var x = new Float32Array(data.x_sab); x[1] = 1.00;
      $.agent.report(report);
      $.agent.leaving();
   })
   `);

// Thread t2
$.agent.start(
   `$.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 0.50;
      var x = new Float32Array(data.x_sab); x[2] = 0.50;
      $.agent.report(report);
      $.agent.leaving();
   })
   `);

// Thread t3
$.agent.start(
   `$.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(2));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(2));
      $.agent.report(report);
      $.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
outputs[0] = "id6_R_t3: 0.00;id7_R_t3: 1.00";
outputs[1] = "id6_R_t3: 0.00;id7_R_t3: 0.00";
outputs[2] = "id6_R_t3: 0.01;id7_R_t3: 1.00";
assert(-1 != outputs.indexOf(report));
