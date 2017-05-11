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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 0;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwis7rgKLT00lNBLW0gPOUrBHoSm6cGcSv57NRoxcWx1XT8O7y3MzkZdw0N4
//GSl3++R7n0gp4sgP12GiboVzF0fB6bOU21308Zk2PC3Fvfi5jiMVbsLEXaQ76PjpZiHOqh5b1ZUqsb3E
//9npsNb/XrJrfaV51047te/yV1VWlu1qnhrrXUNcNdb/husX9HMTDy6N4fsWZtT+zi6f32Wq1l9heYns9
//ttdjezXbqy9783e8Xq6OL/nshE9Pl+50st1Ni26xGHCL6q9FOl1+VfzE2O/nd+c73zbZzsOV5BBwgQAQ
//AAK2EHBrCJTH7AxPAHNVYxiU9kEDaAANw/0/KI/THZMGskBDABpAA2joRUPtj8FYMCj2hfdnoZonKKAA
//FIDCNHkC1RbLA1c90oSLevGdHTMGwAAYAMMkGYMNFlonDMZYnOcO4AJcgItJcge7XNBgXATgAlyAi2mz
//CDMsjJIIYyow7wAoAMUs5x3KgyV7+YQ2yicAA2AADDOZgejOgmk+oQ3zCXABLsDFTOYi+nBBg3GBWQlw
//AS5mNyvRBgsb+YQ2yicQZAIKQDFmPlHJK22mEx6LhcbsBFAACjPPJqyS8F8y0RcKzE2AClAxVS4xEBU0
//EBWYmQAVoGKKTKInFF0SifZM/ALX417w
