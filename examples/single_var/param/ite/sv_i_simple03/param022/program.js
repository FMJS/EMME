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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 < id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[7] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnEtrwkAUhff9FVkqCNPxmhFaXCitdNEHaIvLUJouAlW7iKvS/968rKNOII8ZjZOzG+6YM8nNfBw8
//ODK23oTfm5AxJ/AH3swL+zfO9W3gu9J4uB0ztlz7n1/Rhx8mzsj56QR+31t4Ie9FV1My6vaczlYprqY6
//h9WhVHWVVR6pLd+DVVzvS8pynXLqgxwdN6eerfvrjJ/vnKcX+54sqe+eZ6CsusqqrEBKBVIq0KFC2t3Z
//ZJq0d69n2zuOrryOr95rnWJyqJ7MVphm70+pnyetVk0V54tYMR0n/f1Yr/zRdPw4v+9eMRVAHAABoBMC
//9N8FI/jIPQY8gMcyeMgoPHQ+eDjgATznc56jKT2+I1cBDsCxz3Vqg0MAB+C00HHIjOMQwAE4VjsOmXEc
//Q+DkxdMc4ACcRsXTkldpC6czTd3pGuABPE2KpougUy6YBjgApwWxdBFw6FzgcIADcBoZSVf3G3WuBmgA
//jfVxdHWvATSApqVRdHWnIUADaNoZQ1d3GiPQIIIGNJcRQZOBCJqQpAEe+yNo0h5BAxyA04IImrRH0ITv
//OADH9giaNEfQgAbQWB9Bk+YIGtAAGusjaNIcQQMaQGN9BE2aI2jSF0HH0AhNxwdMb5fdqkK5dUWOhqgN
//jeknK7Phy2ztmh07uAuhXE/Ui6CPbEho+osO+T2JckcIXmdvYAfsNJ4dMsUOnZQdDnbAToN8p87ZG7Xr
//FPjNALgBNxfuOXW4IXADblrqN6TdbwjcgBvr/Ya0+01Rbv4AHL13FQ==
