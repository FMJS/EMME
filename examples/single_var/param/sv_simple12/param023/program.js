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
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
      var x = new Float32Array(data.x_sab); x[2] = 2.0000;
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
outputs[1] = "id6_R_t3: 0.0078;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 2.0000;id7_R_t3: 0.0000";
outputs[3] = "id6_R_t3: 512.0000;id7_R_t3: 0.0000";
outputs[4] = "id6_R_t3: 512.0001;id7_R_t3: 0.0000";
outputs[5] = "id6_R_t3: 0.0000;id7_R_t3: 1.0000";
outputs[6] = "id6_R_t3: 0.0078;id7_R_t3: 1.0000";
outputs[7] = "id6_R_t3: 2.0000;id7_R_t3: 1.0000";
outputs[8] = "id6_R_t3: 512.0000;id7_R_t3: 1.0000";
outputs[9] = "id6_R_t3: 512.0001;id7_R_t3: 1.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2z1PwzAQBuCdX5ERJEQaO7YRiAGEEAsgwcBYIZWhElCGdkL8d/JF49KzQwtxbedlqs7xUSftwznh
//0nS2mL8v5mmaTCdyfD+e85NkdDQqfk6nE7USSNPX2eT5pTj0+iI5Sz72pxM2fhzPs8NiLq9eHRwmRTQv
//X7MyKqpXdbTOXkbrtHU0K454fZq+lXGm5dDj3BDPtex6XBji0vB7m/fzmZzfXiY3dzGu7cd7Z+SK6HVK
//MoOeV5B5BZlXkHkFmbc9q3reNqrnVeSx6uex9TW+v7iqLvJKtu+zVswclbNNg5ltkNkGuW0wtw0K26C0
//DapmUNnWqWzrVLZ1KnqdzWm+ar5K5DujZ9czHx6bmZt8ffdSYAbMgJkbzHr2ijhd3GfKZMcl+w1wgAyQ
//ATKvqrJ1q5bLy81DwjykwkCM94iYOgZiQGxIiC3njczVTWYeYt010b/5JIOha5MLh+oLcAEuH6sv6dA2
//Fd4Gsn/YGGADbIBt19vK5UcgNw8J81AgtOkfdCAGxIBYKNvKP/okg6GLvnCAC3ABrki3lcOovdzCJjLQ
//BtpAm+ON5UZ39n/jXoDPK53hlgE34IYNZ8/PMWO/V9Z94QAaQANoYVZrwqF50Tzf7B+8tX/nyAbBXRVv
//VzQUBNsV6dnbqCCj0nbOqign83IyLyfzcjLvdhBbcUXj03r1qszVqzJXr4qSfOOGJ6b/bepsd1r/yoI1
//sAbW0ALlAWpdrU80dSANpIG0oCo1B81QXnHGe+JspQEKnIGzgXIWa1vUThDb4nYpKjIQBsI8r8h22yDl
//7fayX+IYiANxIG4grVJeIUc/8QRn4AychbbpdNk05dGmE4SBMBA2mE1n3PWYO+KIlikgB+SAXKSNVN4+
//63TCXAbmwByYi7WlytNnoKANtIG2WCq43TZXBfZs9L/o+wJat7gf
