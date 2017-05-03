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
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 514;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 771";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 771";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 771";
outputs[15] = "id6_R_t2: 514;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcJ0bokoLixS3KhQFy6DEBcBa12kK+m7mzRpmKYnmk4ml8W/C2fO5DIJH+Fn
//ON9s0+9tyjlL4iBaRam8YfPbJA4Px5yvN/HHZ9bwuGB37OcyiWX0FqVils1Q+6OrGTuqarJqrKoiexXZ
//q8lqca95tbjToiqyjvV78pXXpdVt11VDXTfUTUM9aLhueT87dv/8wJ5esGbt16z29AFZtXsV2avIXk32
//arLXkL2m3lu849ViuX/JRyt8eLps5jyf3TQoysGQGpR/DarD5ZflJ0aen55dzHx9y2fuLjiFgAQCQAAI
//+EJAnCBQLfO8fwKIqzrDYARoAA2gocf/g2o5xZA0KA80aNAAGkBDJxpOfgyGgkGSL7w7C3aeoIACUAAK
//4+QJ6mSwWnDZIU2o1ctznpkxAAbAABhGyRh8sNA6YXDG4jh3ABfgAlyMkjv45UL1xoUGF+ACXIybRbhh
//4ZREOFNh5xNhcA0qQAWomMqOh2phlb+EwjglFKABNICGyeyDOB8G14zCOGYUAANgAIzJ7I7oAobqDQwN
//MAAGwJjenok2XPjIKYxbThEKUAEqQMWAOYWVXPpMKTTJhWNGARbAAlgYMKPwisJ/CUVXKmr5BLAAFsBi
//wHyiJyxUT1hoYAEsgMUo2URHKs5JJtpD8QuPXGJc
