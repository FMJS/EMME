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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 514;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 514";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 514";
outputs[15] = "id6_R_t2: 514;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYBiHSmBlg4NJXRpC+mQ0RTcwdA0HZyp5N1rx45RnOPWkeXL8G/m6MgX2XyY
//H0m53SXfu0RKEUezcBUm6lZM7+JofjyWcrONPj7ThqeFuBc/13GkwnWYBJN0Bh2ObibipKrZqrGqxPYS
//26vZan6vWTW/07wapB2b9/grqyur265TTV3X1E1NfVZz3eJ+9uLh5VE8v2LNmq9Z5elnbNXuJbaX2F7N
//9mq217C9ptqbv+PVYnl4yScrfHy6dOY0m103GBSDc25Q/TVIx8svi0+MPT8/O5/5ts5m7q8kh4ACAkAA
//CPhCIDhDoFzmafcEMFd1hsEEoAE0gIYO/w/K5Qz6pIE80KBBA2gADa1oOPsx6AsGxb7w9izYeYICCkAB
//KAyTJ9DZYLngqkWaUKkX57wwYwAMgAEwDJIx+GChccLgjMVp7gAuwAW4GCR38MsFdcaFBhfgAlwMm0W4
//YeGURDhTYecT6V8GqAAVoGIsOx7KhSV/CYVxSihAA2gADaPZB3E5DK4ZhXHMKAAGwAAYo9kd0QYM6gwM
//DTAABsAY356JJlz4yCmMY06hQQWoABU95hRWcukzpdAsF64ZBVgAC2Chv4zCKwr/JRRtqajmE8ACWACL
///vKJjrCgjrDQwAJYAItBsomWVFySTDSH4hedV2IQ
