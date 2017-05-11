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
      var x = new Float32Array(data.x_sab); x[0] = 1.5000;
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 0.5000;
      var x = new Float32Array(data.x_sab); x[2] = 0.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 0.1250;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 1.5000";
outputs[3] = "id6_R_t3: 0.1250;id7_R_t3: 1.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmz1PwzAQhnd+RUaQKtLEsS2BGKhQxQJIMDBGSGWoxNfQToj/Tr5oTHt2KG0Tf7ydorv4JWc3D3d2
//L47fl4uP5SKOo/lM5Pf5gp1F49Nx8Tmfz+QvQxy/vs+eX4pbryfRRfR5PJ+l+WO+SEbFWFZdnYyiwpqV
//12lp5dVVba3VS2stW1uT4o7Xp/lbaU8VDdXONPZMUVftXGMXmr/bPM9XdHl7Fd3c+Rjb2rOnZER0nIJU
//UHU5qctJXU7qclK3nVVVt7WqupK8V67fW6/x/WRaLfIvtZ9ZK0aOy9E6Z2JypiYnMzkzk5ObnMLklI1T
//muKUpjilKU5Jx9lM87R5lcgno0fXIx8em5HbvL5HMWAGmAFm/cDswLwipovZjDLRsWR/ARxABpABZFZl
//ZZusWoWX6V1c75JuQIwdDGJJygExQCwoiK3GjfXZTaJ3pd050d74JJxB1zYLh+wL4AK4bMy+RI9sk+4V
//kAAbwAawBVBWrr4Cmd7F9S5H0KZ+0QExQAwQc6Ws3JFPwhl00QsHcAFcAJenZWUYuVffYMNGP8AGsPVa
//Vm61r/8X6jl4Wgm0AW1AmydnmL7vk3UvHHAGnAFnLmZqvEfieXOyOcCOW3LKA8BdZW8jCgWCbUSqemvl
//pFWY5qyyMlKXkbqM1GWk7v9AbIQrWp42c1epz12lPneVFMm3bnVK1f9NnY1Om68ssAasAWtofrIAal1N
//TzTqgDQgDUhzKlProQ3KKpyxg+BsbZ8NOAPOAsWZrw1Rg0DsH9ulyMiAMCDM8oxs2NYoa8tLIA6IA+KC
//LDr3/uMPqyBHn3gCZ8AZcOZa0dlnu5RFRScQBoQBYcEUnX7nY30iDkcDQBwQF0YLlbUnnYAcIAfIeXv+
//6et+2u5dBQAbwAawuZG9DdtW5dip6L7A9w2JXrX4
