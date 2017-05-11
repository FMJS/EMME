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
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 768";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUHWvEknigeHDC8qzMOORegOBec8dCfZd7ddu9Jtb7VL0y2D51bevOmftPwo
//D5FyuUq/V6mUIonDaBql6k4M75N4tD2WcrGM559Zw/NYPIif6yRW0SxKg0E2gzZHNwOxU9Vs1dSqxPYS
//26vZanGvebW406IaZB2Lj+Qrr6tad71ODXXdUDcN9bDhuuX9rMXj65N4ecOatV+zvacP2Wq9l9heYns1
//26vZXsP2mv3e4h1Px5PNS95Z4e3TZTOH+eymwaAcHHGD6q9B2l5+Un5i7Pn52cXM91k+c30lOQQUEAAC
//QMAVAsEBAtUyD/sngLmqNQwmAA2gATT0+H9QLWdwShrIAQ0aNIAG0NCJhoMfg1PBoNgX3p0F5AlAASh4
//kCfQwWC14KpDmrBXL8+JjAEwAIZLyBhcsNA6YbDGArkDuAAXHuQObrmg3rhAFgEuwMWZswg7LKySCGsq
//6vnEKLwFFaACVPiy46FaWHKXUBirhAI0gAbQ4M0+iONhsM0ojGVGATAABsDwZndEFzCoNzA0wAAYAMO/
//PRNtuHCRUxjkFKACVFxATlFLLl2mFJrlAhkFWAAL/mcUTlH4L6HoSgXyCWABLM6XT/SEBfWEBbIJYAEs
//zpNNdKTimGSiPRS/ewFiaA==
