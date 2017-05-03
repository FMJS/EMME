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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 515;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 259";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 259";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 259";
outputs[15] = "id6_R_t2: 515;id7_R_t2: 259";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYBiHcuhLR0aSujSFtIhoyk4g6FpOjhTybvXjh2jOMetI8uX4d/M0ZEvsvkw
//P5Jyu0u+d4mUIo6CcBkm6k5M7+NodjyWcrON1p9pw/NcPIif6zhS4SpMvEk6gw5HNxNxUvXZqjaqxPYS
//2+uz1fxes2p+p3nVSzs2H/FXVldGt1mnmrpfU9c19aDmusX97MXj65N4ecOaNV+zytMHbNXsJbaX2F6f
//7fXZXs326mpv/o6X88XhJZ+s8PHp0pnTbHbdoFcMzrhB9dcgHS+/KD4x9vz87Hzm+yqbub+SHAIEBIAA
//EHCFgHeGQLnM0+4JYK5qDYP2FGgADaChu/+Dcjm9PmkgBzRo0AAaQEMrGs5+DPqCQbEvvD0LZp5AQAEo
//AIVh8gQ6GywXXLVIEyr14pwXZgyAATAAhkEyBhcsNE4YrLE4zR3ABbgAF4PkDm65oM640OACXICLYbMI
//OyyskghrKsx8QukAVIAKUDGWHQ/lwpK7hEJbJRSgATSAhtHsg7gcBtuMQltmFAADYACM0eyOaAMGdQaG
//BhgAA2CMb89EEy5c5BTaMqe4BRWgAlT0mFMYyaXLlMJnubDNKMACWAAL/WUUTlH4L6FoS0U1nwAWwAJY
//9JdPdIQFdYSFBhbAAlgMkk20pOKSZKI5FL9ktmJI
