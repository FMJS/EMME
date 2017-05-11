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
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 515;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 257";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 257";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 257";
outputs[15] = "id6_R_t2: 515;id7_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYAjHcuBlg4NJXRpC+mQ0RTcwdA0HZyp5N1rxxcU57h1ZPky/Js5OvJFNh/m
//R5632yff+8TzRBwF4TpM1K2Y38XRojz2vO0u+vhMG56W4l78XMeRCjdhImfpDDoe3czESdVnq9qoEttL
//bK/PVvN7zar5neZVmXZs3+OvrK6MbrNODXW/oa4b6kHDdYv7OYiHl0fx/Io1a79mtacP2KrZS2wvsb0+
//2+uzvZrt1fXe/B2vl6vjSz5Z4fLp0pnzbHbToCwGF9yg+muQysuvik+MPT8/O5/5tslmHq48DgECAkAA
//CLhCQJ4hUC3zvH8CmKtaw6ClAg2gATT0939QLacckgZyQIMGDaABNHSi4ezHYCgYFPvCu7Ng5gkSKAAF
//oDBOnkBng9WCqw5pQq1enPPCjAEwAAbAMErG4IKF1gmDNRanuQO4ABfgYpTcwS0X1BsXGlyAC3AxbhZh
//h4VVEmFNhZlPKB2AClABKqay46FaWHKXUGirhAI0gAbQMJl9EJfDYJtRaMuMAmAADIAxmd0RXcCg3sDQ
//AANgAIzp7Zlow4WLnEJb5hQLUAEqQMWAOYWRXLpMKXyWC9uMAiyABbAwXEbhFIX/EoquVNTzCWABLIDF
//cPlET1hQT1hoYAEsgMUo2URHKi5JJtpD8Qu2UGI4
