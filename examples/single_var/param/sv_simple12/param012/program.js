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
      var x = new Float32Array(data.x_sab); x[0] = 0.5000;
      var x = new Float32Array(data.x_sab); x[1] = 0.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      var x = new Float32Array(data.x_sab); x[2] = 1.0000;
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
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 0.5000";
outputs[3] = "id6_R_t3: 0.0078;id7_R_t3: 0.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2ztPwzAQB/CdT5ERJETaOLYRiIEKIRZAKkPHCqkMlXgN7YT47uRF47Znp488bOfPVJ3jo07aH+eE
//C8Ov5eJ7uQjDYD4T0/F0wa6CwcUg+bmez+RaIAw/vmZv78mhD6PgJvg5nc+i6WS6GJ4nc1n26uw8SKJx
//+jpKozx7lUfz7Gk0T5tHh8kRH6/zzzQeKTnUONPEYyW7GueauND83uL9/Aa3T3fB47OPa9t47xG5Inqd
//gsyg5uVkXk7m5WReTuYtz6qat4yqeSV5rNw8Nr/G49F9dpHXsv2ftWTmIJ2tGxyaBiPTIDMNxqZBbhoU
//pkFZDErTOqVpndK0TkmvszjN98VXiXxn9Ox85sukmLnP1/ckBGbADJi1g1nDXhGni9lMmai4ZLsAB8gA
//GSCzqirbtmq1vFg/xPVD0g3EGBADYkCsJsRW8wb66maoH4qqa6LafBLO0LXPhQNcgAtw2Vh9iRZtk+5t
//IAEbYANsPdhWrj4CsX6I64ccoU39oNeNmLwEYkAM28pmtpVH+iScoYu+cE3CheoLcKH66nBb2Y/aC7AB
//NsDm9bZyr/v6u6jn4NNK0AbaQJsnzzB9v09WfeHAGTgDZy5WarxF8bx5stkJd7wH3GXxckV9QbBckZq9
//jHIyKkznLIsyMi8j8zIyLyPzHgaxEVe0PG3XrlJfu0p97SopyfdudYrUv02VjU7bX1mwBtbAGpqfLECt
//qumJpg6kgTSQ5lSl1kIblFWcMXAGzsBZY5z52hDVCWIH3C4FYSAMhFlekXXbGmXt9hLEgTgQ18tNZ+3/
///GEVcvQTz+M522iMAmfgDJtOj9qlLNp0NkUYKjIQBsL8b5xyYNMJ4kAciPN209lCC5W1TzqBHJADct4+
////T1ftrxXQWADbABNjeqt27bqhx7KloXfH9aLLXL
