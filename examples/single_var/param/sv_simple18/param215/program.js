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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 257;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 515";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 515";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 515";
outputs[15] = "id6_R_t2: 257;id7_R_t2: 515";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n8JlC4HJzHEUWrpoKKGbtpAuspSCXQhN04VZlbx7NRqZmGNrxvGy+Hdy5oyXUT7k
//Z4TY7tLvXSqEl8RBtIpSdevN75I4PB4LsdnGH59Zw9PCu/d+rpNYResolbNsBh2ObmbeSdVnq9qoEttL
//bK/PVot7zavFnRZVmXVs3pOvvK6MbrNODXW/oa4b6kHDdcv72XsPL4/e8yvWrP2a1Z4+YKtmL7G9xPb6
//bK/P9mq2V9d7i3e8WiwPL/lkhY9Pl82c57ObBmU5GHKD6q9BOl5+WX5i7Pn52cXMt3U+c38lOAQkEAAC
//QMAVAvIMgWqZ5/0TwFzVGgalA9AAGkBDf/8H1XLKIWkgBzSEoAE0gIZONJz9GAwFg2JfeHcWzDyBgAJQ
//AArj5Al0NlgtuOqQJtTq5TkvzBgAA2AADKNkDC5YaJ0wWGNxmjuAC3ABLkbJHdxyQb1xEYILcAEuxs0i
//7LCwSiKsqTDzCS0VqAAVoGIqOx6qhSV3CYW2SihAA2gADZPZB3E5DLYZhbbMKAAGwAAYk9kd0QUM6g2M
//EGAADIAxvT0TbbhwkVNoy5xCgwpQASoGzCmM5NJlSuGzXNhmFGABLICF4TIKpyj8l1B0paKeTwALYAEs
//hssnesKCesIiBBbAAliMkk10pOKSZKI9FL9GLmI4
