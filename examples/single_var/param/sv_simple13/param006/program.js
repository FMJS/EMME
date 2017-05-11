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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[1]; report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 2;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 514;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 258;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 65538;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 66048;id7_R_t3: 0";
outputs[9] = "id6_R_t3: 66050;id7_R_t3: 0";
outputs[10] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[11] = "id6_R_t3: 65794;id7_R_t3: 0";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[13] = "id6_R_t3: 2;id7_R_t3: 1";
outputs[14] = "id6_R_t3: 512;id7_R_t3: 1";
outputs[15] = "id6_R_t3: 514;id7_R_t3: 1";
outputs[16] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[17] = "id6_R_t3: 258;id7_R_t3: 1";
outputs[18] = "id6_R_t3: 65536;id7_R_t3: 1";
outputs[19] = "id6_R_t3: 65538;id7_R_t3: 1";
outputs[20] = "id6_R_t3: 66048;id7_R_t3: 1";
outputs[21] = "id6_R_t3: 66050;id7_R_t3: 1";
outputs[22] = "id6_R_t3: 65792;id7_R_t3: 1";
outputs[23] = "id6_R_t3: 65794;id7_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm01PwkAQhu/+ih41ISntdosf8SAxxIua6MEjMcEDiV8HOBn+uy0tsOCCtt3ZEnluzWx3oN2+D2+Z
//nTD8mE4+p5MwDMajdPgwnKjzoHsxHvUWx2H49jF6ec1OuOkHl8HX8XgUD5+Gk6iTzVDzo5NOkEWT/DjO
//o3p+VESLnHm0yFhEo+yMt+fxex6PjRxmXG2JJ0Z2M663xNMtn1t+n1lwdXcd3N7/x2ubx1dXZGZfRbU1
//mlozmHmVNa+y5lXWvMqad3WvU2vUPFdbz9Wb5xZr/NAfzBd5beUWdy2b2c1nbxuMdg3GuwZVOdjbNbNn
//n1l+8UH5cFrz22cXMx+f8pmzo9Am8xiZI/PDk3lzJa8GlwvflRe55VNrS19HiB/x8xvfSPzLBY58il85
//EH+C+BH/4Ym/6Y9729I3HzaXQIh1ChAAAm6gCS2Wt8QrEsyFqCv+U8SP+HED9d1AO9K3u4HmQEi1VvgB
//kIAfqPC/4U9eLC8+9gkF7UT+OALkT2WggSNoR/x2R+AACWk3AQkgAUdQuSTQNhKUHBI024RAwgEioVmh
//YD89ghgmdO+MnQZgAudQuXzQNigS66PpBgnsPwAJOIeKRYX9dA5SmDBfLiIQASJwDVI9CD8HDcDU70DY
//iJc5K/YlIH2kT/VBqC/BhfD/3JVQGwfrvQoAASDgBYR6FdwCQYkBIQEIAIEdi9L9C3L+QB4S6z0NQAJI
//4BqEehrcYuKXDcwNgHAKEAACrkG6z8GHa5CCxGbvA5gAE/gGod4Ht6DQgkjAOYAEKhLi/RA+nIMYJjZ6
//JMAEmMA5iPRIyFUpvGBCs7UJTLD7UbhvwnftwseLyHovBegAHTgMkV4KuYqGH0ywPwJM4DCE+yt81zlc
//ouMbwpStgQ==
