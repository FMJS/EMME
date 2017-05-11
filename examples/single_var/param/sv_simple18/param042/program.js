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
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 256";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 256";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUHWvEkHigeHDC8qzMOORaiHgnMeupPsu9uuXem2t9ql6ZrBcytv3vRPWn6U
//h0i5Wqff61RKkcRhNI9SdSvGd0k82R1LuVzFH59Zw9NU3Iuf6yRW0SJKg1E2g7ZHNyOxV9Vs1dSqxPYS
//26vZanGvebW406IaZB3L9+Qrr6tad71ODXXdUDcN9bDhuuX9bMTDy6N4fsWatV+zg6cP2Wq9l9heYns1
//26vZXsP2msPe4h3Pp7PtS95b4d3TZTPH+eymwaAcnHCD6q9B2l1+Vn5i7Pn52cXMt0U+c3MlOQQUEAAC
//QMAVAsERAtUyj/sngLmqNQwmAA2gATT0+H9QLWdwThrIAQ0aNIAG0NCJhqMfg3PBoNgX3p0F5AlAASh4
//kCfQ0WC14KpDmnBQL8+JjAEwAIZLyBhcsNA6YbDGArkDuAAXHuQObrmg3rhAFgEuwMXAWYQdFlZJhDUV
//9XxCmRBUgApQ4cuOh2phyV1CYawSCtAAGkCDN/sgTofBNqMwlhkFwAAYAMOb3RFdwKDewNAAA2AADP/2
//TLThwkVOYZBTgApQcQE5RS25dJlSaJYLZBRgASz4n1E4ReG/hKIrFcgngAWwGC6f6AkL6gkLZBPAAlgM
//k010pOKUZKI9FL/V3mIo
