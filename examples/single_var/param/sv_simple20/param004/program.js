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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
      var x = new Int8Array(data.x_sab); x[3] = 1;
      $.agent.report(report);
      $.agent.leaving();
   })
   `);

// Thread t3
$.agent.start(
   `$.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id8_R_t3 = x[0]; report.push("id8_R_t3: "+id8_R_t3);
      var x = new Int16Array(data.x_sab); id9_R_t3 = x[1]; report.push("id9_R_t3: "+id9_R_t3);
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
outputs[0] = "id8_R_t3: 0;id9_R_t3: 0";
outputs[1] = "id8_R_t3: 65536;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 65536;id9_R_t3: 1";
outputs[3] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[5] = "id8_R_t3: 0;id9_R_t3: 1";
outputs[6] = "id8_R_t3: 16843008;id9_R_t3: 256";
outputs[7] = "id8_R_t3: 16843008;id9_R_t3: 257";
outputs[8] = "id8_R_t3: 65536;id9_R_t3: 256";
outputs[9] = "id8_R_t3: 65792;id9_R_t3: 0";
outputs[10] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[11] = "id8_R_t3: 16842752;id9_R_t3: 256";
outputs[12] = "id8_R_t3: 16777472;id9_R_t3: 257";
outputs[13] = "id8_R_t3: 256;id9_R_t3: 257";
outputs[14] = "id8_R_t3: 256;id9_R_t3: 256";
outputs[15] = "id8_R_t3: 65536;id9_R_t3: 257";
outputs[16] = "id8_R_t3: 16777472;id9_R_t3: 256";
outputs[17] = "id8_R_t3: 16842752;id9_R_t3: 257";
outputs[18] = "id8_R_t3: 0;id9_R_t3: 256";
outputs[19] = "id8_R_t3: 0;id9_R_t3: 257";
outputs[20] = "id8_R_t3: 16777216;id9_R_t3: 256";
outputs[21] = "id8_R_t3: 16777216;id9_R_t3: 257";
outputs[22] = "id8_R_t3: 65792;id9_R_t3: 257";
outputs[23] = "id8_R_t3: 65792;id9_R_t3: 256";
assert(-1 != outputs.indexOf(report));
