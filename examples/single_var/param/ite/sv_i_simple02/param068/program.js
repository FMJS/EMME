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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 > 1) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 1;id8_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[3] = "id6_R_t2: 1;id8_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtls9rgzAcxe/7K3JsoZDGJDJWemjppIdug/bQo5RmB2GtPdjT2P8+NVpS+QriD/DwbuH5nsZv/ODj
//PL4nt3vCOYuMH+7DxHtj80VkXss155fYfP+khu2aLdnvJDJeeAwTMUsTMl9NZ+xJVaSqHVWSXkl6Fana
//vWaq3alVReq4nKJrpnuO29Vlja5qdF2j+zXPLfbzx1afG/bxhZk1n1nl7X1Sdb2S9ErSq0ivIr2a9Oqq
//157xfh3kh/w04fLt0uQ8S0/KUOWiKG8SFB8KeQs6bZOHY5a063ys5/hqlsFqd3ifvnCKbwG+wTf47sT3
//Y5Jt6XaPAmyDbbA9GrZVV7bVMGy7vVyAbbANtvvt5Y9xtmjlRbaP/zbYBttgu9dO3oRsupGDa3ANrsfa
//x5twrYbgGl0cXIPrAbu47tDFNf7ZYBtsj7SL69ZdHFyDa3A91i6uW3fxxlz/A7MVL+0=
