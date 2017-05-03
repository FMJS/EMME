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
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      var x = new Float32Array(data.x_sab); x[2] = 1.5000;
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
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 0.5000";
outputs[3] = "id6_R_t3: 0.1250;id7_R_t3: 0.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2z1PwzAQBuCdX5ERpIo0cWxLIAYqVLEAEgyMFVIZKlHK0E6I/06+aFx6dijNh+28TNU5PuqkfTgn
//XBiuNuuPzToMg8VczB5na3YRjM/H6c/lYi53AmG4XM1f39JDbyfBVfB5upjHs+fZOhqlc1n+6mwUpNEk
//ex1nUZ6/KqJF9ixapC2iUXrE8mXxnsVjJYcaZ5p4omRX41wTF5rfW76fr+D6/ia4e/Bxbb/ee0yuiF6n
//IDOoeTmZl5N5OZmXk3mrs6rmraJqXkkeK38fW1zjx8k0v8g72X7OWjpznM3WDUamwdg0yEyDiWmQmwaF
//aVCWg9K0TmlapzStU9LrLE/ztPwqke+Mnl3MfHouZx7y9T0JgRkwA2bdYNayV8TpYjZTJmou2V+AA2SA
//DJBZVZXtW7VdXqIf4voh6QZiDIgBMSDWEGLbeWN9dRPph+L6mqgxn4QzdB1y4QAX4AJcNlZfokPbpHsb
//SMAG2ADbALaV249Aoh/i+iFHaFM/6M0iFsUciAExbCtb2lYe6ZNwhi76wrUHF6ovwIXqq9dt5TBqL8AG
//2ACb19vKg+7r/0U9B59WgjbQBto8eYbp+32y+gsHzsAZOHOxUuMdiufNk81euOMD4C6PVysaCoLVitTs
//VZSTUWE6Z3mUkXkZmZeReRmZ938QG3FFy9N+7Sr1tavU166SkvzgVqdY/dtU2+i0/5UFa2ANrKH5yQLU
//6pqeaOpAGkgDaU5Vah20QVnFGQNn4AyctcaZrw1RvSD2j9ulIAyEgTDLK7J+W6Os3V6COBAH4ga56Wz8
//nz+sQo5+4nksZ3uNUeAMnGHT6VG7lEWbznYIQ0UGwkDYEBqnHNh0gjgQB+K83XR20EJl7ZNOIAfkgJy3
//zz99vZ92fFcBYANsgM2N6q3ftirHnoo2Bd83kr61vQ==
